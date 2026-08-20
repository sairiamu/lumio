# Stage 3 — Themes: 10 → Dark + Light

## Read First
- `src/themes/themes.ts` — currently defines 10 themes (`lumio-dark`, `chalk`, `midnight`,
  `sage`, `aurora`, `slate`, `arctic`, `forest`, `sunset`, `candy`). This is more than
  `context/DESIGN_SYSTEMS.MD` documents — trust the code, not that doc, on this point.
- `src/components/modals/ThemePicker.tsx` — renders all 10 today, needs to become a
  2-option toggle.
- `src/hooks/useTheme.ts` — theme application logic, check how `currentTheme` propagates.
- Run `grep -rn "currentTheme\|themes\[" src/` before deleting anything — multiple
  components likely read theme fields directly.

## Task
1. Reduce `src/themes/themes.ts` to exactly `light` and `dark` theme objects, same
   `Theme` interface/shape as today (don't break consumers' field access).
2. Update `ThemePicker.tsx` to a simple Light/Dark toggle.
3. Placeholder colors: base `dark` on the existing `lumio-dark` theme values, base `light`
   on `chalk` — mark both with a `// TODO: replace with Stage 4 skeuomorphic tokens` comment.
   Final values come from Stage 4, not this stage.
4. Migrate any persisted `currentTheme` value referencing a removed theme id to `'dark'`.

## Open Questions
- Default theme on first launch: OS `prefers-color-scheme`, or always `dark`? Recommend OS
  preference, overridden once user picks manually. Confirm before implementing.