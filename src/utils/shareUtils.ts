import { Node, Edge } from '@xyflow/react';
import { useCanvasStore } from '../store/canvasStore';
import { NodeData, EdgeData } from '../types';

export function buildShareURL(): string {
  const state = useCanvasStore.getState();
  const payload = {
    v: '1',
    nodes: state.nodes,
    edges: state.edges,
  };
  const json = JSON.stringify(payload);
  // btoa might fail with non-latin1 characters, but encodeURIComponent helps.
  // However, for robust Base64 encoding of UTF-8, some extra care might be needed.
  // Given the requirement, I'll follow it.
  const compressed = btoa(encodeURIComponent(json));
  // For desktop app use a custom protocol or localhost preview
  // The requirement says lumio://share#...
  return `lumio://share#${compressed}`;
}

export function decodeShareURL(hash: string): { nodes: Node<NodeData>[], edges: Edge<EdgeData>[] } | null {
  try {
    // Remove the '#' if present
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
    const json = decodeURIComponent(atob(cleanHash));
    const data = JSON.parse(json);
    if (data && data.v === '1' && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
      return {
        nodes: data.nodes,
        edges: data.edges,
      };
    }
    return null;
  } catch {
    return null;
  }
}
