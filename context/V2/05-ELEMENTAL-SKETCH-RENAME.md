# Stage 5 — Wire Existing Canvas into "Elemental Sketch"

## Task
This is a rename + routing stage, NOT a rebuild. The existing Diagram/Freehand canvas
(`CanvasWrapper`, `DiagramCanvas`, `FreehandCanvas`, all `nodes/*`, `ToolBar`, etc.) becomes
what opens when a project's `projectType === 'elemental-sketch'`.

- Rename user-facing strings ("Diagram", etc. where they imply the whole app) to
  "Elemental Sketch" where appropriate — do NOT rename internal type names like
  `CanvasMode = 'diagram' | 'freehand'`, those stay as implementation detail.
- `App.tsx` becomes type-aware: it mounts the Elemental Sketch shell when the loaded
  project is that type, and the Electrical shell (Stage 6) when it's the other type. Extract
  shared chrome (TitleBar, StatusBar) so both shells reuse it rather than duplicating.
- No functional changes to diagram/freehand behavior. This should be a near-zero-risk
  refactor — if you find yourself changing canvas logic, stop, that's out of scope here.

## Non-Goals
- No visual restyling in this stage — that's Stage 4's spec applied incrementally later,
  not bundled into this rename.