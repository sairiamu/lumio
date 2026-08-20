# Stage 7 — Real Simulation (avr8js)

## Depends On
Stage 6's circuit canvas, component/node model, and pin-level netlist data model must exist
and be correct — this stage will feel wrong fast if pin identity isn't already solid.

## Library
`avr8js` (wokwi/avr8js, MIT, pure JS/TS) — emulates the ATmega328p (the Uno's chip) at the
instruction level: real register state, real timers, real PWM, real GPIO. It does not know
about circuits — it only exposes port read/write hooks. You supply:
- Pre-compiled machine code (a `.hex` file — Stage 8 produces this; until Stage 8 exists,
  use a small set of hand-compiled reference `.hex` files for known sketches like Blink, so
  this stage can be built and tested independently of Stage 8).
- "Glue code" connecting AVR port pins to your circuit graph from Stage 6, so that e.g.
  writing digital pin 13 HIGH actually drives current into whatever's wired to that pin.

## Task
- Simulation loop (tick-based, requestAnimationFrame-driven) that:
  1. Steps the avr8js CPU forward.
  2. Reads changed GPIO/PWM pin states after each step batch.
  3. Propagates those states through the netlist from Stage 6 (digital HIGH/LOW is enough
     for v1; simple resistor current/Ohm's-law behavior for LED brightness and resistor
     heat/current display is the "real current behaviour" bar — full SPICE-level analog
     simulation is out of scope for V2).
  4. Updates each component's visual state (LED on/off/brightness, servo angle, buzzer tone)
     via the same `@wokwi/elements` hooks used for placement in Stage 6.
- Play/Pause/Reset controls for the simulation, plus a visible indicator of simulated time
  vs wall time.
- Handle the "no valid .hex yet" state gracefully (component placed but nothing running).

## Non-Goals
- No support for chips beyond ATmega328p/Uno in V2.
- No full analog/SPICE simulation (potentiometers, capacitors behaving with real transient
  curves) — digital + basic Ohm's-law-level analog is the target for V2.

## Open Questions
- None blocking — but flag if reference `.hex` files for early testing should be checked
  into the repo or generated locally via a temporary manual toolchain install.