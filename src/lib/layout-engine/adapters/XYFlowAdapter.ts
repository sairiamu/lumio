import { Node, Edge } from '@xyflow/react';
import { LayoutGraph, LayoutNode, LayoutEdge, PositionUpdate } from '../types';
import { NodeData, EdgeData } from '../../../types';

export class XYFlowAdapter {
  /**
   * Converts XYFlow nodes and edges to the internal LayoutGraph format.
   * Ensures all positions are in absolute coordinate space for the engine.
   */
  static toLayoutGraph(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]): LayoutGraph {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    const getAbsolutePosition = (node: Node): { x: number, y: number } => {
      let x = node.position.x;
      let y = node.position.y;
      let curr = node;
      while (curr.parentId) {
        const parent = nodeMap.get(curr.parentId);
        if (!parent) break;
        x += parent.position.x;
        y += parent.position.y;
        curr = parent;
      }
      return { x, y };
    };

    return {
      nodes: nodes.map(node => {
        const absPos = getAbsolutePosition(node);
        return {
          id: node.id,
          x: absPos.x,
          y: absPos.y,
          width: node.measured?.width ?? (node.type === 'circle' ? 60 : 150),
          height: node.measured?.height ?? (node.type === 'circle' ? 60 : 80),
          parentId: node.parentId,
          semantic: node.data?.semantic
        };
      }),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        semantic: edge.data?.semantic
      }))
    };
  }

  /**
   * Map absolute position updates back to XYFlow nodes (relative space).
   * This does NOT mutate the nodes directly but returns a new array of updated nodes.
   */
  static applyUpdates(nodes: Node<NodeData>[], updates: PositionUpdate[]): Node<NodeData>[] {
    const updateMap = new Map(updates.map(u => [u.id, u]));
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    return nodes.map(node => {
      const update = updateMap.get(node.id);
      if (update) {
        if (node.parentId) {
          // XYFlow positions are relative to the parent.
          // If the parent is also in the update set, use its new absolute position.
          // Otherwise, calculate the parent's current absolute position.
          const parentUpdate = updateMap.get(node.parentId);
          let parentAbsX = 0;
          let parentAbsY = 0;

          if (parentUpdate) {
            parentAbsX = parentUpdate.x;
            parentAbsY = parentUpdate.y;
          } else {
            let curr = nodeMap.get(node.parentId);
            while (curr) {
              parentAbsX += curr.position.x;
              parentAbsY += curr.position.y;
              curr = curr.parentId ? nodeMap.get(curr.parentId) : undefined;
            }
          }

          return {
            ...node,
            position: { x: update.x - parentAbsX, y: update.y - parentAbsY }
          };
        }
        return {
          ...node,
          position: { x: update.x, y: update.y }
        };
      }
      return node;
    });
  }
}
