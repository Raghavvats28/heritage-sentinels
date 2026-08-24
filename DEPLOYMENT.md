# Heritage Sentinels deployment

## 1. Deploy backend

Recommended prototype setup:

1. Push this repository to GitHub.
2. Create a Render Web Service from the repository.
3. Select Docker.
4. Dockerfile: `backend/Dockerfile`.
5. Health check: `/health`.
6. Add environment variables:
   - `APP_ENV=production`
   - `DATABASE_URL=<your PostgreSQL connection string>`
   - `CORS_ORIGINS=https://heritage-sentinels.vercel.app`
   - `OPEN_METEO_ENABLED=true`
   - `OPENAI_API_KEY=<optional>`
7. Deploy and verify `https://YOUR-BACKEND/health` returns JSON with `ok: true`.

For long-term persistence, add S3-compatible object storage for image files. The current local storage mode is suitable for a hackathon demo but container filesystems are not durable production archives.

## 2. Connect Vercel frontend

In Vercel → Project → Settings → Environment Variables, add:

`NEXT_PUBLIC_API_BASE_URL=https://YOUR-BACKEND`

Apply it to Production and Preview, then redeploy.

## 3. Test the real flow

Open the deployed site, scroll to **Evidence-Aware Inspection**, upload a JPG/PNG/WebP, select a known site or provide a site hint, and run the analysis.

The UI should show:

- site identification/confidence
- current-condition screening
- environmental context
- historical evidence timeline
- 50/100/200-year scenario cards
- projected risk and recommendations

## 4. Production hardening after the SIH demo

- move uploads/generated images to S3/Supabase/R2
- use managed PostgreSQL
- add authentication and rate limiting
- replace seeded evidence with verified sources
- add expert approval states
- replace heuristic CV with a validated conservation dataset/model
- log model version, evidence IDs and analysis timestamps
