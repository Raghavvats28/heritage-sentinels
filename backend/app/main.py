from pathlib import Path
from typing import Annotated
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from .analysis import build_predictions, get_environment, historical_image, heuristic_vision, identify_site_from_text, openai_vision, score_risk
from .config import get_settings
from .db import Base, SessionLocal, engine, get_db
from .models import HistoricalEvidence, Inspection, Prediction, Site
from .schemas import EvidenceOut, InspectionOut, PredictionOut, SiteOut
from .seed import seed
from .storage import save_bytes, ensure_dirs

settings = get_settings()
Base.metadata.create_all(bind=engine)
ensure_dirs()
with SessionLocal() as db:
    seed(db)


class RiskRequest(BaseModel):
    severity: float = Field(ge=1, le=10)
    rate_of_change: float = Field(ge=1, le=10)
    significance: float = Field(ge=1, le=10)
    exposure: float = Field(ge=1, le=10)


def risk_category(score: float) -> dict[str, str]:
    if score > 35:
        return {"code": "P1", "label": "P1 - IMMEDIATE", "band": "HIGH"}
    if score > 20:
        return {"code": "P2", "label": "P2 - SCHEDULED", "band": "ELEVATED"}
    if score > 10:
        return {"code": "P3", "label": "P3 - ACTIVE MONITORING", "band": "MODERATE"}
    return {"code": "P4", "label": "P4 - ROUTINE", "band": "LOW"}


app = FastAPI(title="Heritage Sentinels API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=list(dict.fromkeys(settings.cors_list + ["https://heritage-sentinels.vercel.app"])), allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
def health():
    return {"ok": True, "service": "heritage-sentinels-api", "environment": settings.app_env}


@app.post("/api/v1/risk/calculate")
def calculate_risk(payload: RiskRequest):
    score = round((payload.severity * payload.rate_of_change * payload.significance * payload.exposure) / 100, 2)
    category = risk_category(score)
    return {
        "risk_score": score,
        "priority": category["code"],
        "label": category["label"],
        "band": category["band"],
        "formula": "severity × rate_of_change × significance × exposure ÷ 100",
    }

@app.get("/api/v1/sites", response_model=list[SiteOut])
def list_sites(db: Session = Depends(get_db)):
    return db.query(Site).order_by(Site.name).all()

@app.get("/api/v1/sites/{site_id}", response_model=SiteOut)
def get_site(site_id: int, db: Session = Depends(get_db)):
    site = db.get(Site, site_id)
    if not site: raise HTTPException(404, "Site not found")
    return site

@app.get("/api/v1/sites/{site_id}/evidence", response_model=list[EvidenceOut])
def site_evidence(site_id: int, db: Session = Depends(get_db)):
    if not db.get(Site, site_id): raise HTTPException(404, "Site not found")
    return db.query(HistoricalEvidence).filter(HistoricalEvidence.site_id == site_id).order_by(HistoricalEvidence.year).all()

@app.post("/api/v1/inspections", response_model=InspectionOut)
async def create_inspection(
    image: Annotated[UploadFile, File(...)],
    site_id: Annotated[int | None, Form()] = None,
    site_hint: Annotated[str | None, Form()] = None,
    db: Session = Depends(get_db),
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(400, "Please upload a JPG, PNG or WebP image.")
    data = await image.read()
    if len(data) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(413, f"Image exceeds {settings.max_upload_mb} MB limit")
    suffix = Path(image.filename or "upload.jpg").suffix.lower() or ".jpg"
    path = save_bytes(data, suffix)
    site = db.get(Site, site_id) if site_id else None
    if site_id and not site: raise HTTPException(404, "Selected site not found")
    identified, confidence = identify_site_from_text(db, site_hint)
    if site is None: site = identified
    heuristic = heuristic_vision(path)
    provider = openai_vision(path, site_hint or (site.name if site else None))
    analysis = provider if provider and "error" not in provider else heuristic
    if provider and "error" not in provider:
        analysis["provider"] = "multimodal-vision"
    else:
        analysis["provider"] = "local-screening"
        analysis["provider_note"] = "Set OPENAI_API_KEY to enable multimodal site recognition and richer visual analysis."
    if site is None and analysis.get("site_name"):
        identified, confidence = identify_site_from_text(db, str(analysis["site_name"]))
        site = identified
    if site:
        confidence = max(confidence, float(analysis.get("site_confidence", 0) or 0))
    env = get_environment(site.latitude, site.longitude) if site else get_environment(None, None)
    inspection = Inspection(site_id=site.id if site else None, original_filename=image.filename or "upload", image_path=path, status="analyzed", site_confidence=confidence, site_identification=site.name if site else analysis.get("site_name"), analysis_json=analysis, environment_json=env)
    db.add(inspection); db.commit(); db.refresh(inspection)
    risk, drivers = score_risk(heuristic, env)
    recommendations = ["Repeat inspection from the same viewpoint", "Validate AI flags with a qualified conservator"]
    if risk >= 60: recommendations.insert(0, "Prioritize expert inspection of high-risk areas")
    # Do not manufacture a "historical" image from the current upload. A transformed
    # current photo is not historical evidence. Verified archival images can be added
    # later through HistoricalEvidence.image_url and are rendered separately.
    historical_visuals: list[dict] = []
    report = {"risk_score": risk, "risk_band": "HIGH" if risk >= 60 else "MODERATE" if risk >= 30 else "LOW", "drivers": drivers, "recommendations": recommendations, "historical_visuals": historical_visuals, "evidence_policy": "Documented evidence, AI-inferred observations, and projected scenarios are kept separate. No historical image is generated from the current upload."}
    inspection.report_json = report
    db.commit()
    build_predictions(db, inspection, path, risk, drivers)
    db.refresh(inspection)
    return inspection

@app.get("/api/v1/inspections/{inspection_id}", response_model=InspectionOut)
def get_inspection(inspection_id: int, db: Session = Depends(get_db)):
    inspection = db.get(Inspection, inspection_id)
    if not inspection: raise HTTPException(404, "Inspection not found")
    return inspection

@app.get("/api/v1/inspections/{inspection_id}/predictions", response_model=list[PredictionOut])
def predictions(inspection_id: int, db: Session = Depends(get_db)):
    if not db.get(Inspection, inspection_id): raise HTTPException(404, "Inspection not found")
    rows = db.query(Prediction).filter(Prediction.inspection_id == inspection_id).order_by(Prediction.horizon_years, Prediction.id).all()
    return [PredictionOut.model_validate({**r.__dict__, "image_url": f"/api/v1/files/{Path(r.image_path).name}" if r.image_path else None}) for r in rows]

@app.get("/api/v1/files/{filename}")
def file(filename: str):
    for folder in ("uploads", "generated"):
        p = Path(settings.storage_dir) / folder / filename
        if p.exists(): return FileResponse(p)
    raise HTTPException(404, "File not found")
