# Stage 1 — App Shell: Dashboard on Launch

## Current State (verified in code)
- `main.tsx` → `App.tsx` boots directly into the canvas (TitleBar + ToolBar + CanvasWrapper).
- No dashboard, no project list screen exists today.
- Projects already save as `.lumio.json` under `~/Lumio` (see `src/utils/projectDir.ts`).
- Clerk is an installed dependency but has zero active usage in `src/` — do not build real
  auth against it in this stage.

## Task
Add a Dashboard screen shown on app launch, BEFORE the canvas is mounted.
- Lists existing projects found in `~/Lumio` (reuse `ensureProjectsDir`/`getDefaultSavePath`
  patterns already in `projectDir.ts`).
- Each project card: name, last-modified, project type badge (Elemental Sketch / Electrical)
  — type badge depends on Stage 2's project-type field existing in the saved JSON.
- "New Project" button → hands off to Stage 2's project-type picker.
- Opening a project loads it and transitions to the existing canvas shell (`App.tsx` content).
- This is a real *screen* (route/view swap), not a modal.

## Explicit Non-Goals
- No real login/authentication in this stage. "Login" in the product vision is a future
  concept — for now, treat the Dashboard as the local project hub, no account gate.
- Do not remove `SplashScreen.tsx` — Dashboard shows AFTER splash, not instead of it.

## Open Questions (ask before implementing)
- Is "login" meant to be a real account system later (cloud sync, multi-device), or just
  product language for "arriving at your workspace"? This affects whether Stage 1 should
  leave a seam for an auth provider or not.
- Should Dashboard be a new top-level route (`src/pages/Dashboard.tsx`, mirroring how
  `ShareViewer.tsx` is already handled in `main.tsx`), or app-internal state in `App.tsx`?
  Recommend: new page, same pattern as `ShareViewer`, for cleanliness.