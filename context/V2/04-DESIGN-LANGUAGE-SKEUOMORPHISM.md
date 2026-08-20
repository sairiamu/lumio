# Stage 4 — Design Language: Skeuomorphism

## Why This Stage Exists
The current design system (`context/DESIGN_SYSTEMS.MD`) defines Glassmorphism (UI chrome)
+ Claymorphism (canvas shapes). The product direction is shifting toward skeuomorphism —
this matters most for the Arduino components (Stage 6+), where realistic-looking components
(actual LED glow, breadboard texture, resistor color bands) make the tool legible and are
also what Wokwi-style tools rely on for interpretability at a glance.

## Task
Produce an updated design spec (as a doc, `context/DESIGN_SYSTEMS.MD` v2 section or a new
file — agent's call) covering:
- Token set for `light` and `dark` themes only (per Stage 3).
- Skeuomorphic treatment rules for circuit components: realistic shadows/highlights that
  imply physical material (plastic, metal leads, silicon), not flat/glass.
- What, if anything, stays glassmorphic (e.g. modals, panels) vs what goes skeuomorphic
  (circuit components) vs what goes flat/minimal (general UI chrome). Product intent is
  "consistent elements" — meaning one coherent language, not three fighting styles, so this
  spec must resolve that tension explicitly, not leave it ambiguous.
- Icon/typography rules carry over from v1 unless there's a specific reason to change them.

## Deliverable
This stage produces a DESIGN SPEC, not component code. Stages 5+ implement against it.

## Open Questions (important — ask before implementing Stage 6+ visuals)
- Does "skeuomorphism" apply app-wide (replacing glass+clay everywhere), or specifically to
  the Electrical/Arduino canvas, with Elemental Sketch keeping its existing glass+clay look?
  This is the single highest-leverage decision in the whole V2 redesign — get it confirmed
  before any component work starts.
- Any reference images/products the skeuomorphic direction should be benchmarked against
  (e.g. Wokwi's own component style, real Fritzing-style breadboard rendering, something
  else)?