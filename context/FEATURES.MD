# Feature Specifications

## MODE 1 — Diagram Mode (XYFlow)
Default mode on launch.

### Nodes
- Rect, Circle, Diamond, Text, Card — all custom XYFlow nodes
- Add by clicking toolbar shape then clicking canvas
- Double-click node to edit text inline
- Single click to select (shows resize handles + properties panel)
- Drag to move
- Delete with Backspace/Delete key

### Edges (Connections)
- Drag from a node handle to another node to connect
- Edge types: straight, bezier, step
- Edges are labelled (double-click edge to add label)
- Arrow style: forward, bidirectional, none

### Selection
- Click to select single node
- Shift+click to multi-select
- Drag on empty canvas for box selection
- Ctrl+A to select all

### Canvas Controls
- Scroll to zoom
- Middle mouse or Space+drag to pan
- Ctrl+Shift+F to fit all nodes in view
- G to toggle grid snap (16px grid)

## MODE 2 — Freehand Mode (HTML Canvas)
Toggle via toolbar. Overlaid transparently on diagram layer.

### Tools
- Pen — freehand stroke with pressure-like width
- Line — straight line between two points
- Eraser — erase freehand strokes only
- Freehand shapes do NOT interact with XYFlow nodes

## PROPERTIES PANEL (right side)
Appears when a node is selected.

### Style Controls
- Fill colour — 5 clay presets + custom hex input
- Stroke colour + width (1-6px)
- Opacity (20–100%)
- Border radius slider (0–30px)
- Shadow toggle (clay shadow on/off)

### Text Controls
- Font family: Inter / JetBrains Mono / Sora
- Font size: 10–32px
- Font weight: Regular / Medium / Bold
- Text align: left / center / right
- Text colour

## EXPORT MODAL
Three export options:

### SVG Export
- Uses XYFlow toSvg() for diagram layer
- Embeds canvas freehand layer as base64 image within SVG
- Preserves all fonts via font-face embedding
- File name: vibeplan-export-[timestamp].svg

### HTML Export
- Self-contained single .html file
- Inline all CSS (Tailwind utilities extracted)
- Embed fonts as base64 woff2
- Output is static — not interactive, just visual
- File name: vibeplan-export-[timestamp].html

### JSON Export (Save Project)
- Saves XYFlow nodes/edges + freehand strokes + style state
- File name: [user-chosen-name].vibeplan.json
- Load via File > Open in titlebar menu

## KEYBOARD SHORTCUTS
| Key          | Action                  |
|--------------|-------------------------|
| V            | Select tool             |
| R            | Rectangle node          |
| C            | Circle node             |
| D            | Diamond node            |
| T            | Text node               |
| P            | Pen (freehand)          |
| L            | Line tool               |
| E            | Eraser                  |
| Delete/Bksp  | Delete selected         |
| Ctrl+Z       | Undo                    |
| Ctrl+Shift+Z | Redo                    |
| Ctrl+A       | Select all              |
| Ctrl+S       | Save project (JSON)     |
| Ctrl+E       | Open export modal       |
| G            | Toggle grid             |
| F            | Fit view                |
| Escape       | Deselect / exit modal   |