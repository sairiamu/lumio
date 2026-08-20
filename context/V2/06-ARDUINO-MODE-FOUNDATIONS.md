# Stage 6 — Electrical Canvas Foundations (No Simulation)

## Read First
- `src/components/canvas/CanvasWrapper.tsx` and `DiagramCanvas.tsx` — study how
  `@xyflow/react` is currently set up (nodeTypes, edgeTypes, store wiring) — the new
  circuit canvas follows the same pattern, separately.
- `src/components/nodes/BaseNode.tsx`, `UniversalNode.tsx` — existing node component
  conventions to match (props shape, file-per-component).
- `src/components/canvas/CustomEdge.tsx` — existing edge pattern, for reference only; the
  new `WireEdge` is a different concept (see below), don't reuse this file directly.
- `src/store/canvasStore.ts` — Zustand + persist pattern to replicate for the new store.
- `src/components/panels/ShapeLibrary.tsx` — existing component palette pattern to mirror.
- `context/CODING_RULES.MD` — component file rules apply to every new file below.

## Library
`@wokwi/elements` (MIT web components: LED, resistor, pushbutton, potentiometer, buzzer,
servo, breadboard, Arduino Uno). Wrap these, don't rebuild them from scratch. Do NOT add
`avr8js` in this stage — that's Stage 7.

## Task — New Files
- `src/components/canvas/CircuitCanvas.tsx` — new XYFlow instance for Electrical projects,
  parallel to `DiagramCanvas.tsx`.
- `src/components/nodes/circuit/ArduinoUnoNode.tsx`, `LEDNode.tsx`, `ResistorNode.tsx`,
  `PushbuttonNode.tsx`, `PotentiometerNode.tsx`, `BuzzerNode.tsx`, `ServoNode.tsx`,
  `BreadboardNode.tsx` — one wrapper per `@wokwi/elements` component.
- `src/components/canvas/WireEdge.tsx` — new edge type; connects named pins, not free
  handles (see data model below).
- `src/store/circuitStore.ts` — Zustand store, same persist pattern as `canvasStore.ts`.
- `src/components/panels/ComponentPalette.tsx` — mirrors `ShapeLibrary.tsx` for the
  components above.

## Data Model Requirement
Each component node has named pins. Wires connect `(componentId, pinName) →
(componentId, pinName)` — NOT generic XYFlow handle IDs with no semantic meaning. This is
required for Stage 7's simulation and any future netlist export (see
`09-FUTURE-NOTES.md`).

## Non-Goals
No simulation, no code editor. Components place and wire; nothing lights up yet.