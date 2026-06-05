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
import { CanvasState, CanvasMode, ToolType, ShapeStyle, Stroke, NodeData, EdgeData } from '../types';
import { ThemeName } from '../themes/themes';

interface HistorySnapshot {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  freehandStrokes: Stroke[];
}

interface CanvasStore extends CanvasState {
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge<EdgeData>[]) => void;
  setSelectedNodeIds: (selectedNodeIds: string[]) => void;
  setSelectedEdgeIds: (selectedEdgeIds: string[]) => void;
  onNodesChange: OnNodesChange<Node<NodeData>>;
  onEdgesChange: OnEdgesChange<Edge<EdgeData>>;
  onConnect: OnConnect;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  updateEdgeData: (edgeId: string, data: Partial<EdgeData>) => void;
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
  isThemePickerOpen: boolean;
  setThemePickerOpen: (open: boolean) => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
  togglePanelOpen: () => void;
  deleteSelectedNodes: () => void;
  deselectAll: () => void;
  saveJSON: () => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  clipboard: { nodes: Node<NodeData>[]; edges: Edge<EdgeData>[] } | null;
  copy: () => void;
  paste: () => void;
  cut: () => void;
  duplicate: () => void;
  selectAll: () => void;
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeIds: [],
  selectedEdgeIds: [],
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
  isThemePickerOpen: false,
  isPanelOpen: false,
  past: [],
  future: [],
  clipboard: null,
  currentTheme: (localStorage.getItem('vibeplan-theme') as ThemeName) || 'slate',

  setTheme: (theme: ThemeName) => {
    localStorage.setItem('vibeplan-theme', theme);
    set({ currentTheme: theme });
  },

  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  setExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
  setThemePickerOpen: (isThemePickerOpen) => set({ isThemePickerOpen }),
  setIsPanelOpen: (isPanelOpen) => set({ isPanelOpen }),
  togglePanelOpen: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  setSelectedNodeIds: (selectedNodeIds) => set({ selectedNodeIds }),
  setSelectedEdgeIds: (selectedEdgeIds) => set({ selectedEdgeIds }),

  pushHistory: () => {
    const { nodes, edges, freehandStrokes, past } = get();
    const snapshot: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      freehandStrokes: JSON.parse(JSON.stringify(freehandStrokes)),
    };
    const newPast = [...past, snapshot].slice(-50);
    set({ past: newPast, future: [] });
  },

  undo: () => {
    const { past, nodes, edges, freehandStrokes, future } = get();
    if (past.length === 0) return;

    const snapshot = past[past.length - 1];
    const currentSnapshot: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      freehandStrokes: JSON.parse(JSON.stringify(freehandStrokes)),
    };

    set({
      nodes: snapshot.nodes,
      edges: snapshot.edges,
      freehandStrokes: snapshot.freehandStrokes,
      past: past.slice(0, past.length - 1),
      future: [...future, currentSnapshot].slice(-50),
    });
  },

  redo: () => {
    const { future, nodes, edges, freehandStrokes, past } = get();
    if (future.length === 0) return;

    const snapshot = future[future.length - 1];
    const currentSnapshot: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      freehandStrokes: JSON.parse(JSON.stringify(freehandStrokes)),
    };

    set({
      nodes: snapshot.nodes,
      edges: snapshot.edges,
      freehandStrokes: snapshot.freehandStrokes,
      future: future.slice(0, future.length - 1),
      past: [...past, currentSnapshot].slice(-50),
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
    get().pushHistory();
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    }));
  },

  updateEdgeData: (edgeId, data) => {
    get().pushHistory();
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...(edge.data || {}), ...data } as EdgeData }
          : edge
      )
    }));
  },

  onEdgesChange: (changes: EdgeChange<Edge<EdgeData>>[]) => {
    const nextEdges = applyEdgeChanges<Edge<EdgeData>>(changes, get().edges);
    const selectedEdgeIds = nextEdges.filter((edge) => edge.selected).map((edge) => edge.id);
    set({
      edges: nextEdges,
      selectedEdgeIds,
    });
  },

  onConnect: (connection: Connection) => {
    get().pushHistory();
    const newEdge: Edge<EdgeData> = {
      ...connection,
      id: `edge_${Date.now()}`,
      type: 'default',
      data: {
        strokeColor: 'var(--text-muted)',
        strokeWidth: 2,
        strokeStyle: 'solid',
        animated: false,
        lineEnd: 'arrow',
        lineStart: 'none',
        pathType: 'default',
      }
    };
    set({
      edges: addEdge(newEdge, get().edges),
    });
  },

  setCanvasMode: (canvasMode) => set({ canvasMode }),

  setCurrentTool: (currentTool) => {
    const canvasMode = (currentTool === 'draw' || currentTool === 'eraser') ? 'freehand' : 'diagram';
    set({ currentTool, canvasMode });
  },

  deleteSelectedNodes: () => {
    get().pushHistory();
    const { nodes, selectedNodeIds, edges, selectedEdgeIds } = get();
    set({
      nodes: nodes.filter((node) => !selectedNodeIds.includes(node.id)),
      edges: edges.filter((edge) =>
        !selectedEdgeIds.includes(edge.id) &&
        !selectedNodeIds.includes(edge.source) &&
        !selectedNodeIds.includes(edge.target)
      ),
      selectedNodeIds: [],
      selectedEdgeIds: [],
      isPanelOpen: false,
    });
  },

  deselectAll: () => {
    const { nodes, edges } = get();
    set({
      nodes: nodes.map((node) => ({ ...node, selected: false })),
      edges: edges.map((edge) => ({ ...edge, selected: false })),
      selectedNodeIds: [],
      selectedEdgeIds: [],
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

  setShapeStyle: (style) => {
    get().pushHistory();
    set((state) => ({
      shapeStyle: { ...state.shapeStyle, ...style }
    }));
  },

  addFreehandStroke: (stroke) => {
    // We don't push history here because it's called during drawing?
    // Wait, the instruction says "Before adding a freehand stroke (on pointer up)"
    // So we should push history BEFORE adding the final stroke.
    set((state) => ({
      freehandStrokes: [...state.freehandStrokes, stroke]
    }));
  },

  setFreehandStrokes: (freehandStrokes) => set({ freehandStrokes }),

  clearFreehandStrokes: () => {
    get().pushHistory();
    set({ freehandStrokes: [] });
  },

  copy: () => {
    const { nodes, edges, selectedNodeIds, selectedEdgeIds } = get();
    const selectedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));
    const selectedEdges = edges.filter((e) => selectedEdgeIds.includes(e.id));

    if (selectedNodes.length === 0) return;

    set({
      clipboard: {
        nodes: JSON.parse(JSON.stringify(selectedNodes)),
        edges: JSON.parse(JSON.stringify(selectedEdges))
      }
    });
  },

  paste: () => {
    const { clipboard, nodes, edges } = get();
    if (!clipboard) return;

    get().pushHistory();

    const idMap: Record<string, string> = {};
    const newNodes = clipboard.nodes.map((node) => {
      const newId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      idMap[node.id] = newId;
      return {
        ...node,
        id: newId,
        position: { x: node.position.x + 20, y: node.position.y + 20 },
        selected: true,
      };
    });

    const newEdges = clipboard.edges.map((edge) => ({
      ...edge,
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: idMap[edge.source] || edge.source,
      target: idMap[edge.target] || edge.target,
      selected: true,
    }));

    // Deselect old ones
    const currentNodes = nodes.map(n => ({ ...n, selected: false }));
    const currentEdges = edges.map(e => ({ ...e, selected: false }));

    set({
      nodes: [...currentNodes, ...newNodes],
      edges: [...currentEdges, ...newEdges],
      selectedNodeIds: newNodes.map(n => n.id),
      selectedEdgeIds: newEdges.map(e => e.id),
    });
  },

  cut: () => {
    get().copy();
    get().deleteSelectedNodes();
  },

  duplicate: () => {
    const { nodes, edges, selectedNodeIds, selectedEdgeIds } = get();
    const selectedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));
    const selectedEdges = edges.filter((e) => selectedEdgeIds.includes(e.id));

    if (selectedNodes.length === 0) return;

    get().pushHistory();

    const idMap: Record<string, string> = {};
    const newNodes = selectedNodes.map((node) => {
      const newId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      idMap[node.id] = newId;
      return {
        ...node,
        id: newId,
        position: { x: node.position.x + 20, y: node.position.y + 20 },
        selected: true,
      };
    });

    const newEdges = selectedEdges.map((edge) => ({
      ...edge,
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: idMap[edge.source] || edge.source,
      target: idMap[edge.target] || edge.target,
      selected: true,
    }));

    // Deselect current
    const deselectedNodes = nodes.map(n => ({ ...n, selected: false }));
    const deselectedEdges = edges.map(e => ({ ...e, selected: false }));

    set({
      nodes: [...deselectedNodes, ...newNodes],
      edges: [...deselectedEdges, ...newEdges],
      selectedNodeIds: newNodes.map(n => n.id),
      selectedEdgeIds: newEdges.map(e => e.id),
    });
  },

  selectAll: () => {
    const { nodes, edges } = get();
    set({
      nodes: nodes.map((node) => ({ ...node, selected: true })),
      edges: edges.map((edge) => ({ ...edge, selected: true })),
      selectedNodeIds: nodes.map((node) => node.id),
      selectedEdgeIds: edges.map((edge) => edge.id),
    });
  },

  toggleGrid: () => set((state) => ({ isGridEnabled: !state.isGridEnabled })),

  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
}));
