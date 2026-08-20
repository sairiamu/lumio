# Stage 2 — New Project: Type Selection

## Read First
- `src/components/modals/TemplateModal.tsx` — existing starter-template picker. Reuse its
  modal styling/pattern, don't duplicate the modal shell from scratch.
- `src/store/canvasStore.ts` — where project metadata lives; add `projectType` here.
- `src/utils/projectDir.ts` — where `.lumio.json` project files are written; the
  `projectType` field must be persisted into this saved file too.

## Task
1. On "New Project" from `Dashboard.tsx` (Stage 1), show a type picker BEFORE
   `TemplateModal.tsx`:
   - **Elemental Sketch** → proceeds into existing `TemplateModal.tsx` flow unchanged.
   - **Electrical (Arduino Design)** → skips templates, opens blank (Stage 6 canvas).
2. Add `projectType: 'elemental-sketch' | 'electrical'` to:
   - the project metadata shape in `src/types/index.ts`
   - `src/store/canvasStore.ts`'s project state
   - the saved `.lumio.json` structure (via `projectDir.ts` save path)
3. On load, if `projectType` is missing (legacy project file), default to
   `'elemental-sketch'`. Do not write migration tooling beyond this default.

## Non-Goals
- No mixed-type projects. No circuit-specific templates yet.