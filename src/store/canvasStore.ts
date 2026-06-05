import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect
} from '@xyflow/react';
import { CanvasState, CanvasMode, ToolType, ShapeStyle, Stroke, NodeData } from '../types';

interface CanvasStore extends CanvasState {
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeIds: (selectedNodeIds: string[]) => void;
  onNodesChange: OnNodesChange<Node<NodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  setCanvasMode: (mode: CanvasMode) => void;
  setCurrentTool: (tool: ToolType) => void;
  setShapeStyle: (style: Partial<ShapeStyle>) => void;
  addFreehandStroke: (stroke: Stroke) => void;
  setFreehandStrokes: (strokes: Stroke[]) => void;
  clearFreehandStrokes: () => void;
  toggleGrid: () => void;
  setZoomLevel: (zoom: number) => void;
  isExportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
  togglePanelOpen: () => void;
  deleteSelectedNodes: () => void;
  deselectAll: () => void;
  saveJSON: () => void;
  undo: () => void;
  takeSnapshot: () => void;
  past: { nodes: Node<NodeData>[]; edges: Edge[] }[];
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeIds: [],
  canvasMode: 'diagram',
  currentTool: 'select',
  shapeStyle: {
    fill: '#7EB8F7', // Default clay-blue
    stroke: '#3A3D4A',
    strokeWidth: 2,
    fontSize: 13,
    fontFamily: 'JetBrains Mono',
    opacity: 1,
  },
  freehandStrokes: [],
  isGridEnabled: true,
  zoomLevel: 1,
  isExportModalOpen: false,
  isPanelOpen: false,
  past: [],

  setNodes: (nodes) => {
    get().takeSnapshot();
    set({ nodes });
  },
  setEdges: (edges) => {
    get().takeSnapshot();
    set({ edges });
  },
  setExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
  setIsPanelOpen: (isPanelOpen) => set({ isPanelOpen }),
  togglePanelOpen: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  setSelectedNodeIds: (selectedNodeIds) => set({ selectedNodeIds }),

  takeSnapshot: () => {
    const { nodes, edges, past } = get();
    // Only keep last 20 states
    const newPast = [...past, { nodes, edges }].slice(-20);
    set({ past: newPast });
  },

  undo: () => {
    const { past } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: newPast
    });
  },

  onNodesChange: (changes: NodeChange<Node<NodeData>>[]) => {
    const currentNodes = get().nodes;
    const nextNodes = applyNodeChanges<Node<NodeData>>(changes, currentNodes);

    // Persist width/height into node.data and enforce shape-specific rules
    const normalized = nextNodes.map((node) => {
      const w = (node.width as number) || 0;
      const h = (node.height as number) || 0;

      // Circle: lock aspect ratio to square
      if (node.type === 'circle') {
        const size = Math.max(w, h) || 60;
        return {
          ...node,
          width: size,
          height: size,
          data: { ...node.data, width: size, height: size }
        };
      }

      // Default: store measured size into node.data so it persists
      if (w || h) {
        return { ...node, data: { ...node.data, width: w, height: h } };
      }
      return node;
    });

    // Update selectedNodeIds based on the normalized nodes
    const selectedNodeIds = normalized.filter((node) => node.selected).map((node) => node.id);

    set({
      nodes: normalized,
      selectedNodeIds,
    });
  },

  updateNodeData: (nodeId, data) => {
    get().takeSnapshot();
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    }));
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    get().takeSnapshot();
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  setCanvasMode: (canvasMode) => set({ canvasMode }),

  setCurrentTool: (currentTool) => {
    const canvasMode = (currentTool === 'draw' || currentTool === 'eraser') ? 'freehand' : 'diagram';
    set({ currentTool, canvasMode });
  },

  deleteSelectedNodes: () => {
    get().takeSnapshot();
    const { nodes, selectedNodeIds, edges } = get();
    set({
      nodes: nodes.filter((node) => !selectedNodeIds.includes(node.id)),
      edges: edges.filter((edge) => !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)),
      selectedNodeIds: [],
      isPanelOpen: false,
    });
  },

  deselectAll: () => {
    const { nodes } = get();
    set({
      nodes: nodes.map((node) => ({ ...node, selected: false })),
      selectedNodeIds: [],
      isPanelOpen: false,
    });
  },

  saveJSON: () => {
    const { nodes, edges } = get();
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vibeplan-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  setShapeStyle: (style) => set((state) => ({
    shapeStyle: { ...state.shapeStyle, ...style }
  })),

  addFreehandStroke: (stroke) => set((state) => ({
    freehandStrokes: [...state.freehandStrokes, stroke]
  })),

  setFreehandStrokes: (freehandStrokes) => set({ freehandStrokes }),

  clearFreehandStrokes: () => set({ freehandStrokes: [] }),

  toggleGrid: () => set((state) => ({ isGridEnabled: !state.isGridEnabled })),

  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
}));
