# Heritage Sentinels

Evidence-aware heritage preservation intelligence prototype for Smart India Hackathon.

## Product flow

**Capture → identify → analyze → remember → contextualize → project → prioritize → preserve**

The frontend is a Next.js experience and the backend is a FastAPI inspection service.

### Evidence classes

- **Documented** — archival or verified record
- **Observed** — current measurement/context
- **AI-Inferred** — model/computer-vision screening
- **Projected** — scenario-based future risk
- **Simulated** — generated visualization, not a factual forecast

## Run locally

### Frontend

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
# Windows Git Bash
source .venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` in `.env.local`.

## AI mode

The backend works without a paid model using local image heuristics. Add `OPENAI_API_KEY` to enable multimodal site identification and richer visual screening. Future images are intentionally labelled as scenario visualizations.

## Production architecture

- Vercel: Next.js frontend
- Render/Railway/etc.: FastAPI backend
- PostgreSQL: persistent metadata
- S3-compatible object storage: uploaded/generated images
- Optional multimodal AI provider: richer visual analysis
- Open-Meteo: current weather context when coordinates are known

For a serious conservation deployment, replace seeded prototype evidence with verified archival sources and add expert validation workflows.

## Frontend ↔ Backend integration

The Next.js frontend is wired to the FastAPI service through `NEXT_PUBLIC_API_BASE_URL`. The integrated flow includes:

- `InspectionWorkbench` uploads monument images to `POST /api/v1/inspections`.
- Site selection and historical evidence are loaded from `/api/v1/sites` and `/api/v1/sites/{id}/evidence`.
- Future scenario cards load from `/api/v1/inspections/{id}/predictions`.
- The Risk Observatory sliders synchronize with `POST /api/v1/risk/calculate`.
- The National Heritage Grid loads registered sites from the backend instead of using hard-coded monument nodes.

### Run locally

Terminal 1:

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Terminal 2:

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. The backend health endpoint is `http://localhost:8000/health`.

## The main product interaction

The primary Sentinel flow is now **Upload → Past → Present → Future**:

1. Upload a JPG, PNG, or WebP monument photograph.
2. **Present:** image screening, detected condition signals, site identification and environmental context.
3. **Past:** historical evidence cards plus clearly labelled AI-assisted historical visualizations.
4. **Future:** scenario-based deterioration visualizations for 50/100/200 years, with risk and conservation actions.

### Vercel environment variable

The frontend code reads `NEXT_PUBLIC_API_BASE_URL` (not `NEXT_PUBLIC_API_URL`). For the current Render backend use:

`NEXT_PUBLIC_API_BASE_URL=https://heritage-sentinels.onrender.com`
