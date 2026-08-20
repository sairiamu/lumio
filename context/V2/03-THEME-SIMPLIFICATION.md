# Stage 3 — Theme System: Collapse to Dark + Light

## Current State (verified in code)
`src/themes/themes.ts` currently defines 10 themes (`lumio-dark`, `chalk`, `midnight`,
`sage`, `aurora`, `slate`, `arctic`, `forest`, `sunset`, `candy`), each with its own
`colors` object and some with legacy flat properties. `ThemePicker.tsx` renders all of them.
This is a bigger surface than the old `context/DESIGN_SYSTEMS.MD` doc describes — that doc
is stale on this point.

## Task
- Replace the 10-theme system with exactly two: `light` and `dark`.
- Keep the existing `Theme` interface shape (`colors.bg`, `bgElevated`, `canvasBg`, `accent`,
  `text`, `clay1/2/3`, plus the legacy flat fields already read elsewhere in the codebase —
  grep every consumer of `useCanvasStore().currentTheme` and `themes.ts` before deleting
  anything, so nothing silently breaks).
- `ThemePicker.tsx` becomes a simple two-option toggle (or is replaced by a settings toggle
  entirely — agent's call, but keep it discoverable, e.g. in TitleBar or a settings area).
- Color values for `light`/`dark` should be defined per the new skeuomorphic language in
  Stage 4 — do not invent final hex values in this stage if Stage 4 isn't done yet; use
  placeholder values based on the closest existing theme (`chalk` for light, `lumio-dark`
  for dark) and flag them as placeholders in a code comment.
- `currentTheme` persisted value: migrate any saved project/localStorage referencing a
  removed theme id to `'dark'` as a safe default.

## Non-Goals
- Do not build a custom-theme-creator UI. Two themes, hardcoded, is the whole feature.

## Open Questions
- Should theme apply per-OS-preference by default (`prefers-color-scheme`) on first launch,
  or always default to dark? Recommend defaulting to OS preference, override persisted
  after first manual choice.