import { Node, Edge } from '@xyflow/react';

export type CanvasMode = 'diagram' | 'freehand';

export type ToolType = 'select' | 'rect' | 'circle' | 'diamond' | 'text' | 'card' | 'draw' | 'eraser' | 'place';

export interface ShapeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  opacity: number;
}

export interface Stroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  opacity: number;
}

export interface NodeParameter {
  key: string;
  value: string;
}

export interface ShapeLibraryItem {
  id: string;
  label: string;
  lucideIcon: string;
  shapeType: string;
}

export interface ShapeCategory {
  id: string;
  label: string;
  icon: string;
  shapes: ShapeLibraryItem[];
}

export interface NodeData extends Record<string, unknown> {
  title: string
  parameters: NodeParameter[]
  description: string
  content: string
  viewMode: 'compact' | 'expanded'
  clayColor?: string
  strokeColor?: string
  strokeWidth?: number
  strokeStyle?: 'solid' | 'dashed' | 'dotted'
  shapeType?: string
  label?: string
  fontSize?: number
  fontFamily?: string
  textAlign?: 'left' | 'center' | 'right'
  opacity?: number
  clayColorOverride?: string
}

export const defaultNodeData: NodeData = {
  title: '',
  parameters: [],
  description: '',
  content: '',
  viewMode: 'compact',
}

export interface EdgeData extends Record<string, unknown> {
  label?: string;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  animated: boolean;
  lineEnd: 'none' | 'arrow' | 'circle'; // Arrowheads/Jointers
  lineStart: 'none' | 'arrow' | 'circle';
  pathType: 'default' | 'smooth' | 'step' | 'straight' | 'smoothstep';
}

export interface CanvasState {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  canvasMode: CanvasMode;
  currentTool: ToolType;
  shapeStyle: ShapeStyle;
  freehandStrokes: Stroke[];
  penColor: string;
  penWidth: number;
  isGridEnabled: boolean;
  gridStyle: 'none' | 'dots' | 'lines' | 'crosshatch';
  isCommandPaletteOpen: boolean;
  zoomLevel: number;
  isExportModalOpen: boolean;
  isShareModalOpen: boolean;
  isPresentationSetupOpen: boolean;
  isShapeLibraryOpen: boolean;
  pendingNodeType: string | null;
  pendingNodeTitle: string | null;
  trackedNodeId: string | null;
  projectName: string;
  projectPath: string | null;
  isDirty: boolean;
  alignmentGuides: { x?: number; y?: number };
  isPresentationMode: boolean;
  isPresentationFinished: boolean;
  presentationTimer: number;
  isPresentationPlaying: boolean;
  presentationLoop: boolean;
  stepNodes: string[];
  currentStep: number;
  isMinimapOpen: boolean;
  searchQuery: string;
  searchResults: string[];
  expandedNodeId: string | null;
}
