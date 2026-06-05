# Project Folder Structure

```
vibeplan/
├── CONTEXT/                        # AI context files (this folder)
│   ├── PROJECT_OVERVIEW.md
│   ├── TECH_STACK.md
│   ├── DESIGN_SYSTEM.md
│   ├── FOLDER_STRUCTURE.md
│   ├── FEATURES.md
│   ├── COMPONENT_MAP.md
│   └── CODING_RULES.md
│
├── src-tauri/                      # Tauri Rust shell
│   ├── src/
│   │   └── main.rs                 # Window setup, frameless, subwindow logic
│   ├── Cargo.toml
│   └── tauri.conf.json             # Window config, permissions, app name
│
├── src/
│   ├── main.tsx                    # Entry: ClerkProvider + RouterProvider
│   ├── App.tsx                     # Root layout: TitleBar + Workspace
│   ├── index.css                   # Tailwind directives + CSS variable tokens
│   │
│   ├── components/
│   │   ├── shell/
│   │   │   ├── TitleBar.tsx        # Tauri custom titlebar (drag, min, max, close)
│   │   │   └── StatusBar.tsx       # Bottom bar: zoom level, mode, item count
│   │   │
│   │   ├── toolbar/
│   │   │   ├── ToolBar.tsx         # Left vertical toolbar (tool selection)
│   │   │   └── ToolButton.tsx      # Individual tool button with tooltip
│   │   │
│   │   ├── panels/
│   │   │   ├── PropertiesPanel.tsx # Right panel: shape style, text, colour
│   │   │   ├── LayersPanel.tsx     # Layer stack view (optional, phase 2)
│   │   │   └── ColourPicker.tsx    # Custom colour swatch + hex input
│   │   │
│   │   ├── canvas/
│   │   │   ├── CanvasWrapper.tsx   # Manages mode switching: XYFlow vs Freehand
│   │   │   ├── DiagramCanvas.tsx   # XYFlow ReactFlow instance
│   │   │   ├── FreehandCanvas.tsx  # HTML Canvas for drawing mode
│   │   │   └── CanvasControls.tsx  # Zoom in/out, fit view, grid toggle
│   │   │
│   │   ├── nodes/                  # XYFlow custom node types
│   │   │   ├── RectNode.tsx        # Rectangle — claymorphism styled
│   │   │   ├── CircleNode.tsx      # Circle/ellipse node
│   │   │   ├── DiamondNode.tsx     # Decision diamond
│   │   │   ├── TextNode.tsx        # Plain text label node
│   │   │   └── CardNode.tsx        # Rich card with title + body text
│   │   │
│   │   ├── modals/
│   │   │   ├── ExportModal.tsx     # SVG / HTML / JSON export options
│   │   │   ├── SaveModal.tsx       # Tauri file save dialog trigger
│   │   │   └── TemplateModal.tsx   # Starter templates (blank, flowchart, etc)
│   │   │
│   │   └── auth/
│   │       └── AuthGate.tsx        # Clerk sign-in gate for save features
│   │
│   ├── hooks/
│   │   ├── useCanvasMode.ts        # Toggle between diagram and freehand mode
│   │   ├── useShapeStyle.ts        # Global shape style state (fill, stroke, font)
│   │   ├── useExport.ts            # SVG + HTML export logic
│   │   ├── useFileIO.ts            # Tauri save/open file operations
│   │   └── useKeyboardShortcuts.ts # Global keybinds (delete, undo, etc)
│   │
│   ├── store/
│   │   └── canvasStore.ts          # Zustand store: nodes, edges, style, history
│   │
│   ├── types/
│   │   └── index.ts                # All shared TypeScript types/interfaces
│   │
│   └── utils/
│       ├── exportUtils.ts          # Merge canvas layers, build HTML string
│       ├── svgUtils.ts             # SVG serialization helpers
│       └── colorUtils.ts           # Hex/rgba conversions
│
├── public/
│   └── fonts/                      # Self-hosted fallback fonts if needed
│
├── index.html                      # Google Fonts import, root div
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```