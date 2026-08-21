# LUMIO V2 — Overview

## Vision
New project flow: user picks Elemental Sketch (existing diagram/freehand tool) or
Electrical (new Arduino design + offline simulation). Login is a simple gate → Dashboard
for now; email auth + cloud project storage comes later, not in this V2 scope.

## Agent Rules
- Read ONLY this file + your assigned stage file. Do not read ahead into later stages.
- Reference real files by exact path as given in each stage file. If a path doesn't exist,
  stop and say so — don't invent a different location.
- `context/CODING_RULES.MD` applies to all new code (strict TS, no `any`, 150-line
  component cap, hooks/utils split, aria-labels).
- Stage files override `context/*.MD` (v1) on conflict; otherwise v1 docs still apply.
- "Open Questions" in a stage file = stop and ask before implementing that part.
- Each stage must leave the app building and running. No partial/broken states.

## Stage Order
1. `01-LOGIN-DASHBOARD.md` — login gate → Dashboard screen
2. `02-PROJECT-TYPE-SELECTION.md` — new-project type picker
3. `03-THEME-SIMPLIFICATION.md` — 10 themes → Dark + Light
4. `04-DESIGN-LANGUAGE-SKEUOMORPHISM.md` — design spec (doc only)
5. `05-ELEMENTAL-SKETCH-RENAME.md` — route existing canvas under new shell
6. `06-ARDUINO-MODE-FOUNDATIONS.md` — circuit canvas, no simulation
7. `07-ARDUINO-SIMULATION-ENGINE.md` — avr8js simulation
8. `08-ARDUINO-OFFLINE-COMPILE.md` — .ino → .hex via arduino-cli sidecar
9. `09-FUTURE-NOTES.md` — read-only, for later KiCad stage

## Feature Flag (Required — Main Branch Workflow)
We commit directly to `main`, no feature branch. Every stage must stay behind a flag until
the full arc (through at least Stage 6) is ready to ship:

- Add `const V2_ENABLED = import.meta.env.VITE_V2_ENABLED === 'true'` in a shared location
  (e.g. `src/config.ts` if it doesn't exist yet — check first).
- `src/main.tsx` routing: if `V2_ENABLED` is false, boot straight into the current
  `App.tsx` canvas exactly as it works today (no Login/Dashboard). If true, use the new
  Login → Dashboard → project-type flow.
- Default `VITE_V2_ENABLED` to unset/false in any committed `.env` — it's opted into
  locally by the dev, not by default, until we're ready to flip it for a release.
- Do not gate individual internal pieces (store fields, theme changes, node types) behind
  the flag — only the top-level entry routing in `main.tsx`. Internal code can exist and be
  inert; we're flagging the user-facing entry point, not sprinkling flags everywhere.

Priority: get to Stage 6 fast. Stages 1-5 are scaffolding, keep them minimal.