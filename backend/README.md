# Heritage Sentinels API

Production-oriented FastAPI service for the Heritage Sentinels prototype.

## What it does

- accepts a monument photo
- runs local computer-vision screening (works without paid AI)
- optionally calls a multimodal model when `OPENAI_API_KEY` is configured
- stores inspection, site, evidence and prediction records
- pulls current contextual weather from Open-Meteo when coordinates are known
- computes an explainable preservation-risk score
- creates 50/100/200-year scenario visualizations for mitigation/current/stress cases
- exposes JSON APIs and generated files for the Next.js frontend

The future images are explicitly **scenario visualizations**, not claims of exact physical prediction.

## Local

```bash
cd backend
python -m venv .venv
# Windows Git Bash:
source .venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`

## Optional multimodal AI

Set `OPENAI_API_KEY` in `.env`. The service will use the configured vision model for richer site identification and visual observations. Without it, the local CV screening path still works.

## Production

For production, use PostgreSQL and object storage instead of relying on the container filesystem. The included Render configuration is a starting point; add a persistent database URL and an object-storage adapter before treating the service as long-term archival infrastructure.
