from datetime import datetime
from pydantic import BaseModel, Field, AliasPath

class SiteOut(BaseModel):
    id: int
    name: str
    country: str
    region: str | None
    latitude: float | None
    longitude: float | None
    construction_period: str | None
    description: str
    model_config = {"from_attributes": True}

class EvidenceOut(BaseModel):
    id: int
    year: int
    title: str
    evidence_type: str
    source: str
    description: str
    confidence: float
    image_url: str | None
    model_config = {"from_attributes": True}

class PredictionOut(BaseModel):
    id: int
    horizon_years: int
    scenario: str
    risk_score: float
    confidence: float
    drivers: list
    recommendations: list
    image_url: str | None = None
    explanation: str
    model_config = {"from_attributes": True}

class InspectionOut(BaseModel):
    id: int
    site_id: int | None
    original_filename: str
    status: str
    site_confidence: float
    site_identification: str | None
    analysis: dict = Field(validation_alias=AliasPath("analysis_json"))
    environment: dict = Field(validation_alias=AliasPath("environment_json"))
    report: dict = Field(validation_alias=AliasPath("report_json"))
    created_at: datetime
    model_config = {"from_attributes": True}
