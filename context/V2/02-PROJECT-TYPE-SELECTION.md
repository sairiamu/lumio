# Stage 2 — New Project: Type Selection

## Depends On
Stage 1 (Dashboard) must exist. `TemplateModal.tsx` already exists for the old
"pick a starter template" flow (blank/flowchart/etc) — study it before building this;
reuse its modal/glass patterns where sensible, don't duplicate.

## Task
When the user clicks "New Project" from the Dashboard:
1. First screen: choose project type.
   - **Elemental Sketch** — icon + one-line description ("Diagrams, flowcharts, freehand
     sketches") → goes into the existing Diagram/Freehand canvas (see Stage 5).
   - **Electrical (Arduino Design)** — icon + one-line description ("Design and simulate
     Arduino circuits offline") → goes into the new circuit canvas (Stage 6+).
2. After type is picked, existing `TemplateModal` starter-choice flow applies ONLY to
   Elemental Sketch. Electrical projects skip templates for now (start blank) — a
   circuit-specific template list is a later addition, not part of V2.
3. Persist `projectType: 'elemental-sketch' | 'electrical'` in the saved `.lumio.json`
   project file, and in `canvasStore`'s project metadata, so Dashboard can badge it and the
   app knows which canvas shell to mount on open.

## Non-Goals
- No mixed projects (a single project is one type, permanently, in V2).
- No migration tooling for old projects without a `projectType` field — just default them
  to `'elemental-sketch'` when loading a legacy file with the field missing.

## Open Questions
- None — this stage is self-contained given Stage 1 exists.