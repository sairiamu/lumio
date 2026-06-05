# Component Responsibility Map

## Shell Layer
| Component       | Responsibility                                              |
|-----------------|-------------------------------------------------------------|
| TitleBar        | Frameless window: drag region, app name, min/max/close via Tauri window API |
| StatusBar       | Displays: current tool, zoom %, node count, canvas mode     |

## Toolbar
| Component   | Responsibility                                                  |
|-------------|-----------------------------------------------------------------|
| ToolBar     | Vertical strip, left edge. Groups: select, shapes, draw tools. Active tool highlighted with iris accent |
| ToolButton  | Icon + tooltip on hover. Accepts: icon, label, shortcut key, isActive, onClick |

## Canvas Layer
| Component       | Responsibility                                                        |
|-----------------|-----------------------------------------------------------------------|
| CanvasWrapper   | Absolute-positioned container. Renders both DiagramCanvas and FreehandCanvas stacked. Handles mode switching via canvasStore |
| DiagramCanvas   | ReactFlowProvider + ReactFlow instance. Registers all custom node types. Handles onConnect, onNodesChange, onEdgesChange wired to canvasStore |
| FreehandCanvas  | HTML Canvas ref. Active only in freehand mode. Pointer events disabled when in diagram mode |
| CanvasControls  | Floating bottom-left control cluster: zoom in, zoom out, fit view, grid toggle |

## Nodes (all are XYFlow custom nodes)
| Component   | Shape       | Clay Colour Default | Notes                          |
|-------------|-------------|---------------------|--------------------------------|
| RectNode    | Rectangle   | CBlue               | Most common, resize handles    |
| CircleNode  | Circle      | CPurple             | Aspect-ratio locked resize     |
| DiamondNode | Diamond     | CPeach              | CSS rotate(45deg) trick        |
| TextNode    | None        | Transparent         | Just text, no background       |
| CardNode    | Rect+header | CGreen              | Title bar + body text sections |

## Panels
| Component        | Responsibility                                                        |
|------------------|-----------------------------------------------------------------------|
| PropertiesPanel  | Right panel. Conditionally renders based on selected node type. All style controls |
| ColourPicker     | Used inside PropertiesPanel. 5 clay swatches + hex input + opacity    |

## Modals (all use glass panel styling)
| Component      | Trigger              | Content                               |
|----------------|----------------------|---------------------------------------|
| ExportModal    | Ctrl+E or menu       | SVG / HTML / JSON tabs, preview, download button |
| SaveModal      | Ctrl+S               | File name input, Tauri save dialog    |
| TemplateModal  | On first launch      | Blank, Flowchart, System Design, Lesson Plan starters |

## Hooks
| Hook                  | What It Manages                                              |
|-----------------------|--------------------------------------------------------------|
| useCanvasMode         | 'diagram' or 'freehand' — single source of truth            |
| useShapeStyle         | Current fill/stroke/font settings for new shapes             |
| useExport             | Calls XYFlow toSvg(), merges layers, builds HTML string      |
| useFileIO             | Tauri invoke calls for save/open JSON project files          |
| useKeyboardShortcuts  | Registers window keydown listeners, maps to store actions    |

## Store (Zustand)
canvasStore holds:
- nodes: Node[]
- edges: Edge[]
- selectedNodeIds: string[]
- canvasMode: 'diagram' | 'freehand'
- currentTool: ToolType
- shapeStyle: ShapeStyle
- freehandStrokes: Stroke[]
- history: HistorySnapshot[] (for undo/redo, max 50)
- isGridEnabled: boolean
- zoomLevel: number