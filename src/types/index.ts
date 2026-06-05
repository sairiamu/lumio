import { Node, Edge } from '@xyflow/react';

export type CanvasMode = 'diagram' | 'freehand';

export type ToolType = 'select' | 'rect' | 'circle' | 'diamond' | 'text' | 'card' | 'draw' | 'eraser';

export interface ShapeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  opacity: number;
}

export interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  opacity: number;
}

export interface NodeParameter {
  key: string;
  value: string;
}

export interface NodeData extends Record<string, unknown> {
  title: string;
  parameters: NodeParameter[];
  description: string;
  color?: string;
  strokeColor?: string;
  label?: string;
}

export interface EdgeData extends Record<string, unknown> {
  label?: string;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  animated: boolean;
  lineEnd: 'none' | 'arrow' | 'circle'; // Arrowheads/Jointers
  lineStart: 'none' | 'arrow' | 'circle';
  pathType: 'default' | 'smooth' | 'step' | 'straight';
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
  isGridEnabled: boolean;
  zoomLevel: number;
  isExportModalOpen: boolean;
}
