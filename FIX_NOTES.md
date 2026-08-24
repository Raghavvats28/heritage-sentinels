# Heritage Sentinels — Fix Notes

This archive preserves the existing Next.js/FastAPI application and applies targeted fixes.

## Changes
- Kept the existing Next.js UI and InspectionWorkbench workflow.
- Removed the duplicate `next.config.mjs`; consolidated its Three.js transpilation settings into `next.config.ts`.
- Kept the frontend API base URL controlled by `NEXT_PUBLIC_API_BASE_URL`.
- Added production CORS configuration to `backend/render.yaml` for the Vercel frontend and local development.
- Fixed the OpenAI multimodal response handling so detailed observation arrays are normalized into the score map expected by the existing risk engine. The detailed observations are retained as `observation_details`.
- Did not change `gpt-5.6-luna`: the current OpenAI code uses the Responses API with image input, and the model is listed by OpenAI as a current GPT-5.6 Luna model.
- Removed the misleading behavior that transformed the current upload into fake “historical” images. Historical images are now shown only when real historical evidence is attached.
- Made the uploaded image explicitly visible in the Present section of the existing InspectionWorkbench.
- Marked prototype historical records as unverified instead of visually presenting them as verified documentation.
- Replaced the 192-frame coffee sequence in `public/images/sequence/` with 192 frames extracted from the existing `public/temple.mp4`. This fixes the actual source of the coffee imagery rather than changing a filename.
- Updated the package-lock root package name from the old `coffeeaate` value to `heritage-sentinels`.

## Verification performed
- FastAPI `/health`: passed locally.
- FastAPI `/api/v1/sites`: passed locally.
- Multipart `/api/v1/inspections`: passed locally with a temple frame.
- Prediction endpoint: passed locally and returned 9 predictions.
- Existing local-screening fallback works without an OpenAI key.
- The frontend dependency install/build could not be completed in this environment because `npm ci` timed out before dependencies were installed; therefore a local Next.js production build is not claimed as passed here.
- Vercel production was independently observed as a healthy Next.js deployment (not FastAPI), and no recent production HTTP 500 runtime logs were returned for the project during the checked window.
