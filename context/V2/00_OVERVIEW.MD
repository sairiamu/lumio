# LUMIO V2 — Overview & Rules for the Coding Agent

## What V2 Is
LUMIO is evolving from a single-purpose diagram tool into a project-type-aware app.
On creating a new project, the user picks one of:
1. **Elemental Sketch** — the existing Diagram + Freehand canvas (renamed, not rebuilt)
2. **Electrical (Arduino Design)** — new: offline Arduino circuit design + simulation

A future third type ("KiCad / agentic circuit design") is planned but OUT OF SCOPE for all
V2 stage files. Do not build toward it. Only avoid data-model decisions that would make it
impossible later (see 09-FUTURE-NOTES.md).

## Rules for the Agent
- Read ONLY `00-OVERVIEW.md` + the single stage file you are assigned. Do not read ahead
  into later stage files and infer unstated requirements from them.
- The existing `context/*.MD` files (v1) are still accurate for the current app UNLESS a V2
  stage file explicitly says otherwise. V2 files override v1 on conflict.
- If a stage file has an "Open Questions" section, STOP and ask the human before writing
  code that depends on the unresolved item. Do not guess.
- Follow `context/CODING_RULES.MD` exactly (strict TS, no `any`, 150-line component cap,
  hooks/utils for logic, aria-labels, named constants).
- Every stage ships independently buildable and running — never leave the app in a broken
  state between stages.
- Do not touch Clerk. It's an installed dependency with no active integration in the
  codebase today. Auth/login for V2 is being treated as local-first for now (see 01).

## Stage Order
| # | File | What it does |
|---|------|---------------|
| 1 | 01-APP-SHELL-DASHBOARD.md | Launch screen / project hub, replaces boot-to-canvas |
| 2 | 02-PROJECT-TYPE-SELECTION.md | New-project flow, Elemental Sketch vs Electrical |
| 3 | 03-THEME-SIMPLIFICATION.md | Collapse 10 themes → Dark + Light only |
| 4 | 04-DESIGN-LANGUAGE-SKEUOMORPHISM.md | New shared visual language spec |
| 5 | 05-ELEMENTAL-SKETCH-RENAME.md | Wire existing canvas into the new project-type shell |
| 6 | 06-ARDUINO-MODE-FOUNDATIONS.md | Circuit canvas shell, static components, no sim |
| 7 | 07-ARDUINO-SIMULATION-ENGINE.md | Real digital/analog simulation (avr8js) |
| 8 | 08-ARDUINO-OFFLINE-COMPILE.md | .ino → .hex offline compile pipeline |
| 9 | 09-FUTURE-NOTES.md | Non-actionable — data-model notes for later KiCad stage |

Priority: stages 1–5 are scaffolding. Stage 6 is where "Arduino design" actually starts
being visible to the user. Stages 1–5 should be done fast and kept minimal — don't gold-plate
the dashboard before the Arduino feature exists.