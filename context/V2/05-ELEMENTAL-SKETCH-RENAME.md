# Stage 5 — Route Existing Canvas as "Elemental Sketch"

## Read First
- `src/App.tsx` — current single canvas shell (TitleBar + ToolBar + CanvasWrapper).
- `src/components/canvas/CanvasWrapper.tsx`, `DiagramCanvas.tsx`, `FreehandCanvas.tsx` —
  the canvas being wrapped, unchanged functionally.
- `src/components/shell/TitleBar.tsx`, `src/components/shell/StatusBar.tsx` — shared chrome
  to extract so both Elemental Sketch and Electrical (Stage 6) shells can reuse it.

## Task
1. Extract shared chrome (`TitleBar`, `StatusBar`) out of `App.tsx` so it's reusable by
   both project-type shells.
2. `App.tsx` (or a new `src/pages/ProjectShell.tsx` if cleaner) branches on
   `projectType` (from Stage 2): `'elemental-sketch'` → current canvas content unchanged;
   `'electrical'` → Stage 6's new canvas (stub OK if Stage 6 isn't built yet).
3. Update user-facing strings only ("Diagram" → "Elemental Sketch" in UI labels). Do NOT
   rename internal types like `CanvasMode = 'diagram' | 'freehand'` in
   `src/types/index.ts` — that stays as-is.

## Non-Goals
- Zero changes to diagram/freehand canvas logic or visuals. This is routing/extraction only.