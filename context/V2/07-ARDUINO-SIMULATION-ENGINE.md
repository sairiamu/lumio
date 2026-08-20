# Stage 7 — Real Simulation (avr8js)

## Read First
- `src/store/circuitStore.ts` and the pin/wire model from Stage 6 — simulation reads and
  writes through this store's component/wire state, don't build a parallel state tree.
- `src/components/nodes/circuit/*` — components whose visual state (LED brightness, servo
  angle) the simulation loop updates each tick.

## Library
`avr8js` (MIT) — emulates the ATmega328p (Uno's chip): real registers, timers, PWM, GPIO.
It has no concept of circuits — you feed it a `.hex` (compiled sketch) and read/write pin
state via its exposed hooks; propagating that through the Stage 6 wire graph is this
stage's job.

## Task
- `src/hooks/useCircuitSimulation.ts` (or similar, follow `src/hooks/` conventions) —
  tick loop (requestAnimationFrame): step avr8js CPU → read changed GPIO/PWM pins → walk
  the Stage 6 netlist from each changed pin → update connected component visual state via
  `circuitStore.ts`.
- Digital HIGH/LOW + basic Ohm's-law-level analog (LED brightness from resistor value,
  resistor current) is the target — NOT full SPICE/transient analog simulation.
- Play/Pause/Reset controls, sim-time indicator.
- Until Stage 8 exists, test against a small set of hand-compiled reference `.hex` files
  (e.g. Blink) — confirm with the human whether these get checked into the repo before
  adding any binary files.

## Non-Goals
Only ATmega328p/Uno in V2. No full analog simulation.