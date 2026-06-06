import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
import { Template } from '../data/templates';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface HistorySnapshot {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  freehandStrokes: Stroke[];
}

interface CanvasStore extends CanvasState {
  recentProjects: string[];
  addRecentProject: (path: string) => void;
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
  setPenColor: (color: string) => void;
  setPenWidth: (width: number) => void;
  addFreehandStroke: (stroke: Stroke) => void;
  setFreehandStrokes: (strokes: Stroke[]) => void;
  clearFreehandStrokes: () => void;
  toggleGrid: () => void;
  setZoomLevel: (zoom: number) => void;
  isExportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  isPresentationSetupOpen: boolean;
  setPresentationSetupOpen: (open: boolean) => void;
  isThemePickerOpen: boolean;
  setThemePickerOpen: (open: boolean) => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
  togglePanelOpen: () => void;
  isShapeLibraryOpen: boolean;
  setIsShapeLibraryOpen: (open: boolean) => void;
  pendingNodeType: string | null;
  setPendingNodeType: (type: string | null) => void;
  pendingNodeTitle: string | null;
  setPendingNodeTitle: (title: string | null) => void;
  trackedNodeId: string | null;
  setTrackedNodeId: (id: string | null) => void;
  projectName: string;
  projectPath: string | null;
  isDirty: boolean;
  setProjectName: (name: string) => void;
  setProjectPath: (path: string | null) => void;
  setIsDirty: (dirty: boolean) => void;
  setAlignmentGuides: (guides: { x?: number; y?: number }) => void;
  deleteSelectedNodes: () => void;
  deselectAll: () => void;
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
  isTemplateModalOpen: boolean;
  setTemplateModalOpen: (open: boolean) => void;
  customTemplates: Template[];
  addCustomTemplate: (template: Template) => void;
  deleteCustomTemplate: (id: string) => void;
  togglePresentationMode: () => void;
  isPresentationFinished: boolean;
  setIsPresentationFinished: (v: boolean) => void;
  startPresentation: (autoAdvance: boolean) => void;
  setPresentationTimer: (s: number) => void;
  setIsPresentationPlaying: (v: boolean) => void;
  togglePresentationLoop: () => void;
  setStepNodes: (ids: string[]) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  exitStepMode: () => void;
  addToStepNodes: (nodeId: string) => void;
  clearStepNodes: () => void;
  isMinimapOpen: boolean;
  toggleMinimap: () => void;
  searchQuery: string;
  searchResults: string[];
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  setGridStyle: (style: 'none' | 'dots' | 'lines' | 'crosshatch') => void;
  toggleCommandPalette: () => void;
  isCommandPaletteOpen: boolean;
  groupSelectedNodes: () => void;
  ungroupSelectedNodes: () => void;
  toasts: ToastMessage[];
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  isHelpModalOpen: boolean;
  setHelpModalOpen: (open: boolean) => void;
  isAppReady: boolean;
  setIsAppReady: (ready: boolean) => void;
  setExpandedNodeId: (id: string | null) => void;
}

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set, get) => ({
      recentProjects: [],
      addRecentProject: (path: string) => {
        set((state) => {
          const filtered = state.recentProjects.filter((p) => p !== path);
          return {
            recentProjects: [path, ...filtered].slice(0, 5),
          };
        });
      },
      nodes: [],
      edges: [],
      selectedNodeIds: [],
      selectedEdgeIds: [],
      canvasMode: 'diagram',
      currentTool: 'select',
      shapeStyle: {
        fill: 'var(--accent)',
        stroke: 'var(--border)',
        strokeWidth: 2,
        fontSize: 13,
        fontFamily: 'JetBrains Mono',
        opacity: 1,
      },
      freehandStrokes: [],
      penColor: 'var(--text)',
      penWidth: 3,
      isGridEnabled: true,
      gridStyle: 'dots',
      isCommandPaletteOpen: false,
      zoomLevel: 1,
      isExportModalOpen: false,
      isShareModalOpen: false,
      isPresentationSetupOpen: false,
      isThemePickerOpen: false,
      isPanelOpen: false,
      isShapeLibraryOpen: false,
      pendingNodeType: null,
      pendingNodeTitle: null,
      trackedNodeId: null,
      projectName: 'Untitled Project',
      projectPath: null,
      isDirty: false,
      alignmentGuides: {},
      isPresentationMode: false,
      isPresentationFinished: false,
      presentationTimer: 5,
      isPresentationPlaying: false,
      presentationLoop: false,
      stepNodes: [],
      currentStep: -1,
      isMinimapOpen: false,
      searchQuery: '',
      searchResults: [],
      isSearchOpen: false,
      expandedNodeId: null,
      past: [],
      future: [],
      clipboard: null,
      currentTheme: (localStorage.getItem('lumio-theme') as ThemeName) || 'slate',
      isTemplateModalOpen: false,
      customTemplates: JSON.parse(localStorage.getItem('lumio-custom-templates') || '[]'),
      isHelpModalOpen: false,
      isAppReady: false,
      toasts: [],

      setTemplateModalOpen: (isTemplateModalOpen) => set({ isTemplateModalOpen }),

      addCustomTemplate: (template) => {
        set((state) => {
          const newTemplates = [...state.customTemplates, template];
          localStorage.setItem('lumio-custom-templates', JSON.stringify(newTemplates));
          return { customTemplates: newTemplates };
        });
      },

      deleteCustomTemplate: (id) => {
        set((state) => {
          const newTemplates = state.customTemplates.filter((t) => t.id !== id);
          localStorage.setItem('lumio-custom-templates', JSON.stringify(newTemplates));
          return { customTemplates: newTemplates };
        });
      },

      setProjectName: (projectName) => set({ projectName }),
      setProjectPath: (projectPath) => set({ projectPath }),
      setIsDirty: (isDirty) => set({ isDirty }),
      setAlignmentGuides: (alignmentGuides) => set({ alignmentGuides }),

      setTheme: (theme: ThemeName) => {
        localStorage.setItem('lumio-theme', theme);
        set({ currentTheme: theme });
      },

      setNodes: (nodes) => {
        set({ nodes, isDirty: true });
      },
      setEdges: (edges) => {
        set({ edges, isDirty: true });
      },
      setExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
      setShareModalOpen: (isShareModalOpen) => set({ isShareModalOpen }),
      setPresentationSetupOpen: (isPresentationSetupOpen) => set({ isPresentationSetupOpen }),
      setThemePickerOpen: (isThemePickerOpen) => set({ isThemePickerOpen }),
      setIsPanelOpen: (isPanelOpen) => set({ isPanelOpen }),
      togglePanelOpen: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      setIsShapeLibraryOpen: (isShapeLibraryOpen) => set({ isShapeLibraryOpen }),
      setPendingNodeType: (pendingNodeType) => set({ pendingNodeType }),
      setPendingNodeTitle: (pendingNodeTitle) => set({ pendingNodeTitle }),
      setTrackedNodeId: (trackedNodeId) => set({ trackedNodeId }),
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
          isDirty: true
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
          isDirty: true
        });
      },

      onNodesChange: (changes: NodeChange<Node<NodeData>>[]) => {
        const currentNodes = get().nodes;
        const nextNodes = applyNodeChanges<Node<NodeData>>(changes, currentNodes);

        const isActuallyMutating = changes.some(c => c.type !== 'select');

        const normalized = nextNodes.map((node) => {
          const w = (node.width as number) || 0;
          const h = (node.height as number) || 0;

          if (node.type === 'circle') {
            const size = Math.max(w, h) || 60;
            return {
              ...node,
              width: size,
              height: size,
              data: { ...node.data, width: size, height: size }
            };
          }

          if (w || h) {
            return { ...node, data: { ...node.data, width: w, height: h } };
          }
          return node;
        });

        const selectedNodeIds = normalized.filter((node) => node.selected).map((node) => node.id);

        set({
          nodes: normalized,
          selectedNodeIds,
          ...(isActuallyMutating ? { isDirty: true } : {})
        });
      },

      updateNodeData: (nodeId, data) => {
        get().pushHistory();
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...data } }
              : node
          ),
          isDirty: true
        }));
      },

      updateEdgeData: (edgeId, data) => {
        get().pushHistory();
        set((state) => ({
          edges: state.edges.map((edge) =>
            edge.id === edgeId
              ? { ...edge, data: { ...(edge.data || {}), ...data } as EdgeData }
              : edge
          ),
          isDirty: true
        }));
      },

      onEdgesChange: (changes: EdgeChange<Edge<EdgeData>>[]) => {
        const nextEdges = applyEdgeChanges<Edge<EdgeData>>(changes, get().edges);
        const selectedEdgeIds = nextEdges.filter((edge) => edge.selected).map((edge) => edge.id);
        const isActuallyMutating = changes.some(c => c.type !== 'select');
        set({
          edges: nextEdges,
          selectedEdgeIds,
          ...(isActuallyMutating ? { isDirty: true } : {})
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
          isDirty: true
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
          isDirty: true
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

      setShapeStyle: (style) => {
        get().pushHistory();
        set((state) => ({
          shapeStyle: { ...state.shapeStyle, ...style },
          isDirty: true
        }));
      },

      setPenColor: (penColor) => set({ penColor }),
      setPenWidth: (penWidth) => set({ penWidth }),

      addFreehandStroke: (stroke) => {
        set((state) => ({
          freehandStrokes: [...state.freehandStrokes, stroke],
          isDirty: true
        }));
      },

      setFreehandStrokes: (freehandStrokes) => set({ freehandStrokes, isDirty: true }),

      clearFreehandStrokes: () => {
        get().pushHistory();
        set({ freehandStrokes: [], isDirty: true });
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

        const currentNodes = nodes.map(n => ({ ...n, selected: false }));
        const currentEdges = edges.map(e => ({ ...e, selected: false }));

        set({
          nodes: [...currentNodes, ...newNodes],
          edges: [...currentEdges, ...newEdges],
          selectedNodeIds: newNodes.map(n => n.id),
          selectedEdgeIds: newEdges.map(e => e.id),
          isDirty: true
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

        const deselectedNodes = nodes.map(n => ({ ...n, selected: false }));
        const deselectedEdges = edges.map(e => ({ ...e, selected: false }));

        set({
          nodes: [...deselectedNodes, ...newNodes],
          edges: [...deselectedEdges, ...newEdges],
          selectedNodeIds: newNodes.map(n => n.id),
          selectedEdgeIds: newEdges.map(e => e.id),
          isDirty: true
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

      togglePresentationMode: () => set((state) => {
        if (!state.isPresentationMode) {
          return { isPresentationSetupOpen: true };
        }
        return { isPresentationMode: false, isPresentationPlaying: false, isPresentationFinished: false, currentStep: -1 };
      }),

      setIsPresentationFinished: (isPresentationFinished) => set({ isPresentationFinished }),

      startPresentation: (autoAdvance) => set({
        isPresentationMode: true,
        isPresentationPlaying: autoAdvance,
        isPresentationFinished: false,
        currentStep: 0,
        isPresentationSetupOpen: false
      }),

      setPresentationTimer: (presentationTimer) => set({ presentationTimer }),
      setIsPresentationPlaying: (isPresentationPlaying) => set({ isPresentationPlaying }),
      togglePresentationLoop: () => set((state) => ({ presentationLoop: !state.presentationLoop })),

      setStepNodes: (stepNodes) => set({ stepNodes }),

      setStep: (currentStep) => set({ currentStep }),

      nextStep: () => set((state) => {
        if (state.stepNodes.length === 0) return state;
        const nextStep = state.currentStep + 1;
        if (nextStep >= state.stepNodes.length) {
          if (state.presentationLoop) {
            return { currentStep: 0 };
          }
          return { isPresentationFinished: true, isPresentationPlaying: false };
        }
        return { currentStep: nextStep };
      }),

      prevStep: () => set((state) => {
        if (state.stepNodes.length === 0) return state;
        const prevStep = state.currentStep - 1;
        if (prevStep < 0) return state;
        return { currentStep: prevStep };
      }),

      exitStepMode: () => set({ currentStep: -1 }),

      addToStepNodes: (nodeId: string) => set((state) => {
        if (state.stepNodes.includes(nodeId)) return state;
        return { stepNodes: [...state.stepNodes, nodeId] };
      }),

      clearStepNodes: () => set({ stepNodes: [], currentStep: -1 }),

      toggleMinimap: () => set((state) => ({ isMinimapOpen: !state.isMinimapOpen })),

      setSearchQuery: (searchQuery) => {
        const { nodes } = get();
        const results = searchQuery
          ? nodes
              .filter((n) => n.data?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((n) => n.id)
          : [];
        set({ searchQuery, searchResults: results });
      },

      setIsSearchOpen: (isSearchOpen) => set({ isSearchOpen }),

      setGridStyle: (gridStyle) => set({ gridStyle }),
      toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

      addToast: (message, type) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type }]
        }));
        setTimeout(() => {
          get().removeToast(id);
        }, 2500);
      },
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      },

      setHelpModalOpen: (isHelpModalOpen) => set({ isHelpModalOpen }),
      setIsAppReady: (isAppReady) => set({ isAppReady }),
      setExpandedNodeId: (expandedNodeId) => set({ expandedNodeId }),

      groupSelectedNodes: () => {
        const { nodes, selectedNodeIds } = get();
        const selectedNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
        if (selectedNodes.length < 2) return;

        get().pushHistory();

        const minX = Math.min(...selectedNodes.map(n => n.position.x));
        const minY = Math.min(...selectedNodes.map(n => n.position.y));
        const maxX = Math.max(...selectedNodes.map(n => n.position.x + (n.measured?.width || 150)));
        const maxY = Math.max(...selectedNodes.map(n => n.position.y + (n.measured?.height || 100)));

        const width = maxX - minX + 40;
        const height = maxY - minY + 40;
        const groupId = `group_${Date.now()}`;

        const groupNode: Node<NodeData> = {
          id: groupId,
          type: 'group',
          position: { x: minX - 20, y: minY - 20 },
          data: {
            title: 'Group',
            parameters: [],
            description: '',
            content: '',
            viewMode: 'compact'
          },
          style: { width, height },
        };

        const updatedNodes = nodes.map(n => {
          if (selectedNodeIds.includes(n.id)) {
            return {
              ...n,
              parentId: groupId,
              extent: 'parent' as const,
              position: {
                x: n.position.x - (minX - 20),
                y: n.position.y - (minY - 20)
              }
            };
          }
          return n;
        });

        set({
          nodes: [groupNode, ...updatedNodes],
          selectedNodeIds: [groupId],
          isDirty: true
        });
      },

      ungroupSelectedNodes: () => {
        const { nodes, selectedNodeIds } = get();
        const groupsToUngroup = nodes.filter(n => n.type === 'group' && selectedNodeIds.includes(n.id));

        if (groupsToUngroup.length === 0) return;

        get().pushHistory();

        let nextNodes = [...nodes];

        groupsToUngroup.forEach(group => {
          nextNodes = nextNodes.map(n => {
            if (n.parentId === group.id) {
              return {
                ...n,
                parentId: undefined,
                extent: undefined,
                position: {
                  x: n.position.x + group.position.x,
                  y: n.position.y + group.position.y
                }
              };
            }
            return n;
          }).filter(n => n.id !== group.id);
        });

        set({ nodes: nextNodes, isDirty: true });
      },
    }),
    {
      name: 'lumio-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        recentProjects: state.recentProjects,
        gridStyle: state.gridStyle
      }),
    }
  )
);
