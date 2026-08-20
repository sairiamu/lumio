# Stage 4 — Design Spec: Skeuomorphism (Doc Only, No Code)

## Read First
- `context/DESIGN_SYSTEMS.MD` — current Glassmorphism (chrome) + Claymorphism (canvas
  shapes) spec. This stage decides what replaces or coexists with it.
- Output of Stage 3 (`light`/`dark` theme shape in `src/themes/themes.ts`).

## Task
Write an updated design spec (append to `context/DESIGN_SYSTEMS.MD` or new file — agent's
choice) covering:
- Final `light`/`dark` color tokens (replacing Stage 3's placeholders).
- Skeuomorphic treatment for circuit components (Stage 6+): realistic material shadows/
  highlights (plastic, metal, silicon) — this is what makes LED/resistor/breadboard
  components read clearly at a glance, matching how Wokwi's own components look.
- Scope boundary: skeuomorphism applies to the Electrical/circuit canvas components only.
  Elemental Sketch (existing diagram/freehand canvas) keeps its current glass+clay look
  unchanged. General app chrome (TitleBar, Dashboard, modals) — agent should propose
  whether it stays glass or simplifies, and flag that specific choice back before Stage 5+
  visual work depends on it.

## Deliverable
A doc, not components. Stage 6 implements circuit component visuals against this.