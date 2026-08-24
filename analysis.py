from __future__ import annotations
import base64, json, math
from pathlib import Path
from typing import Any
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import httpx
from sqlalchemy.orm import Session
from config import get_settings
from .models import Inspection, Site, Prediction
from .storage import save_bytes

settings = get_settings()


def _clamp(x: float, lo=0, hi=100) -> float:
    return round(max(lo, min(hi, x)), 1)


def _load_image(path: str) -> Image.Image:
    return Image.open(path).convert("RGB")


def heuristic_vision(path: str) -> dict[str, Any]:
    image = _load_image(path)
    arr = np.array(image)
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    hsv = cv2.cvtColor(arr, cv2.COLOR_RGB2HSV)
    edges = cv2.Canny(gray, 70, 150)
    edge_density = float(np.mean(edges > 0))
    dark = gray < 85
    low_sat = hsv[:, :, 1] < 55
    bright = hsv[:, :, 2] > 120
    discolor = np.logical_and(low_sat, bright)
    discoloration = _clamp(float(np.mean(discolor)) * 180)
    crack = _clamp(edge_density * 900)
    moisture = _clamp(float(np.mean(np.logical_and(hsv[:, :, 1] < 90, hsv[:, :, 2] < 150))) * 130)
    vegetation = _clamp(float(np.mean((hsv[:, :, 0] > 30) & (hsv[:, :, 0] < 95) & (hsv[:, :, 1] > 80))) * 140)
    brightness = float(gray.mean())
    blur = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    return {
        "method": "local-computer-vision-heuristic",
        "evidence_class": "AI-Inferred",
        "quality": {"brightness": round(brightness, 1), "sharpness": round(blur, 1), "edge_density": round(edge_density, 4)},
        "observations": {
            "surface_discoloration": discoloration,
            "crack_like_edges": crack,
            "moisture_like_texture": moisture,
            "vegetation_like_regions": vegetation,
        },
        "notes": ["This baseline is a screening aid, not a structural diagnosis.", "Expert validation is required for conservation decisions."],
    }


def identify_site_from_text(db: Session, hint: str | None) -> tuple[Site | None, float]:
    if not hint:
        return None, 0
    q = hint.strip().lower()
    sites = db.query(Site).all()
    exact = next((s for s in sites if s.name.lower() in q or q in s.name.lower()), None)
    return (exact, 98.0) if exact else (None, 0)


def openai_vision(path: str, site_hint: str | None) -> dict[str, Any] | None:
    if not settings.openai_api_key:
        return None
    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.openai_api_key)
        mime = "image/jpeg"
        suffix = Path(path).suffix.lower()
        if suffix == ".png": mime = "image/png"
        elif suffix == ".webp": mime = "image/webp"
        data = base64.b64encode(Path(path).read_bytes()).decode("ascii")
        prompt = f"""You are the screening vision layer of a heritage conservation prototype. Analyze the supplied monument photo. Site hint: {site_hint or 'unknown'}. Return ONLY valid JSON with keys site_name, site_confidence, observations, drivers, recommendations, summary. observations must be an array of objects with type, severity_0_100, confidence_0_100, evidence_class, explanation. Do not claim a causal relationship is proven from one image. Mark uncertain visual inferences accordingly."""
        response = client.responses.create(model=settings.vision_model, input=[{"role":"user","content":[{"type":"input_text","text":prompt},{"type":"input_image","image_url":f"data:{mime};base64,{data}"}]}])
        text = response.output_text.strip()
        if text.startswith("```"):
            text = text.strip("`").replace("json", "", 1).strip()
        return json.loads(text)
    except Exception as exc:
        return {"error": f"vision_provider_failed: {type(exc).__name__}"}


def get_environment(lat: float | None, lon: float | None) -> dict[str, Any]:
    if not settings.open_meteo_enabled or lat is None or lon is None:
        return {"source": "unavailable", "current": {}, "note": "Provide site coordinates to enable live environmental data."}
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {"latitude": lat, "longitude": lon, "current": "temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m", "timezone": "auto"}
        r = httpx.get(url, params=params, timeout=8)
        r.raise_for_status()
        current = r.json().get("current", {})
        return {"source": "Open-Meteo", "current": current, "note": "Weather observations are contextual signals, not proof of material causation."}
    except Exception:
        return {"source": "unavailable", "current": {}, "note": "Live weather service unavailable; analysis continues without it."}


def future_image(path: str, severity: float, horizon: int, scenario: str) -> str:
    image = _load_image(path)
    # Scenario controls a transparent deterioration overlay; deliberately presented as a visualization, not a factual reconstruction.
    strength = severity / 100 * min(1.0, horizon / 200) * ({"mitigation": 0.55, "current": 1.0, "stress": 1.35}.get(scenario, 1.0))
    gray = image.convert("L")
    noise = np.random.default_rng(horizon + len(scenario)).normal(0, 16, (image.height, image.width)).clip(-30, 30).astype(np.int16)
    arr = np.array(gray, dtype=np.int16)
    arr = np.clip(arr - (noise * strength), 0, 255).astype(np.uint8)
    degraded = Image.fromarray(arr).convert("RGB")
    degraded = Image.blend(image, degraded, min(0.7, 0.15 + strength * 0.35))
    draw = ImageDraw.Draw(degraded, "RGBA")
    count = max(4, int(8 + 55 * strength))
    rng = np.random.default_rng(horizon * 13 + len(scenario))
    for _ in range(count):
        x = int(rng.integers(0, image.width))
        y = int(rng.integers(0, image.height))
        length = int(rng.integers(max(12, image.width // 80), max(25, image.width // 12)))
        draw.line((x, y, min(image.width, x + length), min(image.height - 1, y + int(rng.integers(-18, 19)))), fill=(100, 70, 45, int(35 + 110 * strength)), width=max(1, int(image.width / 900)))
    degraded = ImageEnhance.Contrast(degraded).enhance(1 + strength * 0.15).filter(ImageFilter.GaussianBlur(radius=min(1.4, strength * 0.8)))
    out = Path(save_bytes(b"", ".webp", "generated"))
    degraded.save(out, format="WEBP", quality=84, method=6)
    return str(out)



def historical_image(path: str, year: int) -> str:
    image = _load_image(path)
    if year <= 1900:
        gray = image.convert("L").convert("RGB")
        sepia = Image.new("RGB", image.size, (150, 120, 80))
        image = Image.blend(gray, sepia, 0.28).filter(ImageFilter.GaussianBlur(radius=0.35))
    else:
        image = ImageEnhance.Color(image).enhance(0.72).filter(ImageFilter.GaussianBlur(radius=0.15))
    draw = ImageDraw.Draw(image, "RGBA")
    draw.rectangle((18, 18, 220, 58), fill=(8, 8, 9, 205))
    draw.text((30, 30), f"AI-ASSISTED HISTORICAL VIEW · {year}", fill=(230, 205, 150, 230))
    out = Path(save_bytes(b"", ".webp", "generated"))
    image.save(out, format="WEBP", quality=84, method=6)
    return str(out)

def score_risk(analysis: dict, environment: dict) -> tuple[float, list[str]]:
    obs = analysis.get("observations", {})
    crack = float(obs.get("crack_like_edges", 0) or 0)
    moisture = float(obs.get("moisture_like_texture", 0) or 0)
    discolor = float(obs.get("surface_discoloration", 0) or 0)
    vegetation = float(obs.get("vegetation_like_regions", 0) or 0)
    score = crack * 0.40 + moisture * 0.30 + discolor * 0.18 + vegetation * 0.12
    drivers = []
    if crack > 45: drivers.append("crack-like edge density")
    if moisture > 40: drivers.append("moisture-like texture")
    if discolor > 40: drivers.append("surface discoloration")
    if vegetation > 35: drivers.append("vegetation-like growth")
    current = environment.get("current", {})
    humidity = float(current.get("relative_humidity_2m", 0) or 0)
    if humidity > 75:
        score += 6
        drivers.append("high current relative humidity")
    return _clamp(score), drivers


def build_predictions(db: Session, inspection: Inspection, source_path: str, risk: float, drivers: list[str]):
    scenarios = [("mitigation", "Preventive conservation", 0.55), ("current", "Current conditions continue", 1.0), ("stress", "Elevated environmental stress", 1.35)]
    preds = []
    for horizon in (50, 100, 200):
        for key, label, mult in scenarios:
            projected = _clamp(risk * (0.45 + horizon / 100) * mult)
            recs = [
                "Repeat image-based inspection on a fixed viewpoint",
                "Have a qualified conservator validate flagged areas",
            ]
            if "moisture-like texture" in drivers:
                recs.insert(0, "Prioritize moisture-path inspection and drainage review")
            if "crack-like edge density" in drivers:
                recs.insert(0, "Prioritize crack mapping and repeat measurement")
            img = future_image(source_path, projected, horizon, key)
            p = Prediction(inspection_id=inspection.id, horizon_years=horizon, scenario=label, risk_score=projected, confidence=0.62 if key == "current" else 0.54, drivers=drivers, recommendations=recs, image_path=img, explanation=f"Projected scenario for {horizon} years under '{label}'. This is a planning visualization, not a guaranteed physical forecast.")
            db.add(p)
            preds.append(p)
    db.commit()
    return preds
