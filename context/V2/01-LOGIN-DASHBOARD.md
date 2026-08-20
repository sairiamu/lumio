# Stage 1 — Login Gate → Dashboard

## Read First
- `src/main.tsx` — current mount logic, and how `src/pages/ShareViewer.tsx` is routed as
  an alternate top-level view. Follow this exact pattern for the new pages.
- `src/App.tsx` — currently mounts straight into the canvas shell (TitleBar + ToolBar +
  CanvasWrapper). This becomes the "after Dashboard" view, not the first thing shown.
- `src/components/shell/SplashScreen.tsx` — keep this, Login/Dashboard come after it.
- `src/utils/projectDir.ts` — `ensureProjectsDir()` and `getDefaultSavePath()` already give
  you the `~/Lumio` project folder. Use these, don't reimplement.

## Task
1. Create `src/pages/Login.tsx` — simple gate screen, no real auth logic yet (see note
   below). A single "Continue" / "Get Started" action moves to Dashboard.
2. Create `src/pages/Dashboard.tsx` — lists projects found via `ensureProjectsDir()`.
   Each card: project name, last-modified, type badge (depends on Stage 2's `projectType`
   field — if missing, badge as "Elemental Sketch" default). "New Project" button → Stage
   2's picker. Clicking a project → loads it, mounts `App.tsx`'s canvas shell.
3. Wire routing in `src/main.tsx` following the same pattern used for `ShareViewer.tsx`.

## Auth Note (per product decision)
Login is a placeholder gate only — no real authentication yet. Do NOT wire Clerk (it's an
installed but unused dependency — confirm via `grep -r "Clerk" src/` before touching it).
Structure `Login.tsx` so a real auth provider can be dropped in later (e.g. an
`onAuthenticated()` callback boundary) without a rewrite — but build nothing beyond that
seam now.

## Non-Goals
- No cloud storage, no email auth, no multi-user — that's a future stage, not V2.