from datetime import datetime
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import Base

class Site(Base):
    __tablename__ = "sites"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(180), index=True)
    country: Mapped[str] = mapped_column(String(80), default="India")
    region: Mapped[str | None] = mapped_column(String(120))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    construction_period: Mapped[str | None] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    inspections = relationship("Inspection", back_populates="site", cascade="all, delete-orphan")
    evidence = relationship("HistoricalEvidence", back_populates="site", cascade="all, delete-orphan")

class Inspection(Base):
    __tablename__ = "inspections"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    site_id: Mapped[int | None] = mapped_column(ForeignKey("sites.id"), nullable=True)
    original_filename: Mapped[str] = mapped_column(String(255))
    image_path: Mapped[str] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(40), default="uploaded")
    site_confidence: Mapped[float] = mapped_column(Float, default=0)
    site_identification: Mapped[str | None] = mapped_column(String(180))
    analysis_json: Mapped[dict] = mapped_column(JSON, default=dict)
    environment_json: Mapped[dict] = mapped_column(JSON, default=dict)
    report_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    site = relationship("Site", back_populates="inspections")
    predictions = relationship("Prediction", back_populates="inspection", cascade="all, delete-orphan")

class HistoricalEvidence(Base):
    __tablename__ = "historical_evidence"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    site_id: Mapped[int] = mapped_column(ForeignKey("sites.id"))
    year: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(220))
    evidence_type: Mapped[str] = mapped_column(String(80))
    source: Mapped[str] = mapped_column(String(400))
    description: Mapped[str] = mapped_column(Text)
    confidence: Mapped[float] = mapped_column(Float, default=1)
    image_url: Mapped[str | None] = mapped_column(String(500))
    site = relationship("Site", back_populates="evidence")

class Prediction(Base):
    __tablename__ = "predictions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    inspection_id: Mapped[int] = mapped_column(ForeignKey("inspections.id"))
    horizon_years: Mapped[int] = mapped_column(Integer)
    scenario: Mapped[str] = mapped_column(String(80))
    risk_score: Mapped[float] = mapped_column(Float)
    confidence: Mapped[float] = mapped_column(Float)
    drivers: Mapped[list] = mapped_column(JSON, default=list)
    recommendations: Mapped[list] = mapped_column(JSON, default=list)
    image_path: Mapped[str | None] = mapped_column(String(500))
    explanation: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    inspection = relationship("Inspection", back_populates="predictions")
