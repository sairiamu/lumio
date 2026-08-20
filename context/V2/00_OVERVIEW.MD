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

Priority: get to Stage 6 fast. Stages 1-5 are scaffolding, keep them minimal.