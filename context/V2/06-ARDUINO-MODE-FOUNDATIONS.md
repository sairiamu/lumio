# Stage 6 — Electrical Mode Foundations (Arduino, No Simulation Yet)

## Goal of This Stage
Get a circuit canvas on screen with placeable, wireable components. NO current/voltage
simulation yet — that's Stage 7. This stage is about the canvas, node types, and wiring
model being correct, since Stage 7 builds directly on top of it.

## Recommended Libraries (researched, MIT-licensed, offline-capable)
- `@wokwi/elements` — web components for LED, resistor, pushbutton, potentiometer, buzzer,
  servo, breadboard, Arduino Uno board, etc. Visual + hookable, not full simulation on their
  own. Use these as the base rendering for components rather than drawing from scratch —
  restyle per Stage 4's skeuomorphic spec via CSS custom properties/slots as needed.
- Do NOT pull in `avr8js` in this stage — that's Stage 7.

## Task
- New canvas shell for Electrical projects, parallel to `DiagramCanvas` — likely its own
  `@xyflow/react` instance (`CircuitCanvas.tsx`) so wiring/zoom/pan reuse XYFlow's proven
  interaction model rather than reinventing it.
- New node types (XYFlow custom nodes), each wrapping the matching `@wokwi/elements` web
  component: Arduino Uno, LED, resistor, pushbutton, potentiometer, buzzer, servo,
  breadboard. Follow `CODING_RULES.MD` — one component per file, `[Name]Props` interface,
  150-line cap (a thin wrapper around a web component should comfortably fit).
- New edge type `WireEdge` — represents a physical wire between two pins/breadboard holes,
  not a generic diagram connector. Wires should snap to defined pin/hole coordinates on
  each component, not connect anywhere on the node body.
- New `circuitStore` (Zustand, same pattern as `canvasStore.ts`) holding component
  instances, wires, and (unused for now, prepped for Stage 7) placeholder fields for
  simulation state.
- A component palette (parallel to `ShapeLibrary.tsx`) listing the components above.

## Data Model Requirement (important for Stage 7 + future KiCad stage)
Model wires as a **netlist-friendly graph**: each component has named pins, each wire
connects `(componentId, pinName) → (componentId, pinName)`. Do not model wiring as generic
XYFlow source/target handles with no pin semantics — Stage 7's simulation and any future
netlist export both need real pin identity.

## Non-Goals
- No simulation, no code editor, no compile pipeline. Components sit there and can be wired;
  nothing lights up yet.