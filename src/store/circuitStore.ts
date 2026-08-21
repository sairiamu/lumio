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

export interface CircuitNodeData extends Record<string, unknown> {
  label?: string;
  type: string; // The @wokwi/elements tag name
  attrs?: Record<string, any>; // Attributes for the web component
}

export interface CircuitEdgeData extends Record<string, unknown> {
  color?: string;
}

interface CircuitStore {
  nodes: Node<CircuitNodeData>[];
  edges: Edge<CircuitEdgeData>[];
  setNodes: (nodes: Node<CircuitNodeData>[]) => void;
  setEdges: (edges: Edge<CircuitEdgeData>[]) => void;
  onNodesChange: OnNodesChange<Node<CircuitNodeData>>;
  onEdgesChange: OnEdgesChange<Edge<CircuitEdgeData>>;
  onConnect: OnConnect;
  addNode: (node: Node<CircuitNodeData>) => void;
  deleteSelected: () => void;
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
}

export const useCircuitStore = create<CircuitStore>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      isDirty: false,

      setNodes: (nodes) => set({ nodes, isDirty: true }),
      setEdges: (edges) => set({ edges, isDirty: true }),

      onNodesChange: (changes: NodeChange<Node<CircuitNodeData>>[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
          isDirty: true
        });
      },

      onEdgesChange: (changes: EdgeChange<Edge<CircuitEdgeData>>[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
          isDirty: true
        });
      },

      onConnect: (connection: Connection) => {
        const newEdge: Edge<CircuitEdgeData> = {
          ...connection,
          id: `wire_${Date.now()}`,
          type: 'wire',
          data: { color: 'red' }
        };
        set({
          edges: addEdge(newEdge, get().edges),
          isDirty: true
        });
      },

      addNode: (node) => {
        set({
          nodes: [...get().nodes, node],
          isDirty: true
        });
      },

      deleteSelected: () => {
        const { nodes, edges } = get();
        const selectedNodes = nodes.filter(n => n.selected);
        const selectedEdges = edges.filter(e => e.selected);

        if (selectedNodes.length === 0 && selectedEdges.length === 0) return;

        set({
          nodes: nodes.filter(n => !n.selected),
          edges: edges.filter(e =>
            !e.selected &&
            !selectedNodes.some(sn => sn.id === e.source || sn.id === e.target)
          ),
          isDirty: true
        });
      },

      setIsDirty: (isDirty) => set({ isDirty }),
    }),
    {
      name: 'lumio-circuit-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
