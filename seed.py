from sqlalchemy.orm import Session
from .models import Site, HistoricalEvidence

SEED_SITES = [
    {
        "name": "Konark Sun Temple",
        "region": "Odisha",
        "latitude": 19.8876,
        "longitude": 86.0945,
        "construction_period": "13th century CE",
        "description": "Seeded prototype site for the Heritage Sentinels demonstration. Historical evidence should be replaced or expanded with verified archival records for production use.",
    },
    {
        "name": "Taj Mahal",
        "region": "Agra, Uttar Pradesh",
        "latitude": 27.1751,
        "longitude": 78.0421,
        "construction_period": "17th century CE",
        "description": "Seeded prototype site for demonstrating environmental stress and conservation-risk workflows.",
    },
    {
        "name": "Qutub Minar",
        "region": "Delhi",
        "latitude": 28.5245,
        "longitude": 77.1855,
        "construction_period": "12th–13th century CE",
        "description": "Seeded prototype site for demonstrating inspection, evidence and risk workflows.",
    },
]

def seed(db: Session):
    if db.query(Site).count() > 0:
        return
    for item in SEED_SITES:
        site = Site(**item)
        db.add(site)
        db.flush()
        for year, title, etype, source, desc, conf in [
            (1800, "Historical baseline", "archival-baseline", "Prototype historical record", "Baseline placeholder representing archival evidence before modern monitoring.", 0.70),
            (1950, "Mid-century condition reference", "photographic-reference", "Prototype photographic record", "Reference point for demonstrating temporal comparison; replace with verified source imagery.", 0.70),
            (2000, "Modern conservation reference", "inspection-reference", "Prototype inspection record", "Reference point for demonstrating recent condition comparison.", 0.75),
            (2026, "Current observation baseline", "current-observation", "Heritage Sentinels inspection", "Current user-uploaded image becomes the primary observation for the inspection.", 1.00),
        ]:
            db.add(HistoricalEvidence(site_id=site.id, year=year, title=title, evidence_type=etype, source=source, description=desc, confidence=conf))
    db.commit()
