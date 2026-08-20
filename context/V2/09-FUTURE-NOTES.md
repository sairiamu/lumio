# Notes for a Future "KiCad / Agentic Circuit Design" Stage — NOT ACTIONABLE NOW

Not a task. Read-only context so Stage 6's data model doesn't need revisiting later.

- Stage 6's netlist model (`(componentId, pinName) → (componentId, pinName)` wires) should
  be sufficient to export to a generic netlist format (e.g. simple JSON netlist, or eventual
  KiCad `.net`/schematic format) without redesigning the wiring model — confirm this holds
  as Stage 6 is implemented, flag if it doesn't.
- "Agentic circuit design" implies an AI agent proposing/editing circuits programmatically
  later — this means the circuit data model should be plain serializable state (already true
  if it's a Zustand store persisted as JSON, consistent with how `canvasStore` already
  works), not something requiring the UI to reconstruct state via imperative calls.
- Nothing here should influence Stage 6–8 scope. This file exists purely so a future agent
  doesn't have to reverse-engineer these constraints from scratch.