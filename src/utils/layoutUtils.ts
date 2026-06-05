import { Node, Edge } from '@xyflow/react';

export function autoLayout(nodes: Node[], edges: Edge[]): Node[] {
  // Build adjacency: find root nodes (no incoming edges)
  const hasIncoming = new Set(edges.map(e => e.target));
  const roots = nodes.filter(n => !hasIncoming.has(n.id));

  // BFS level assignment
  const levels: Map<string, number> = new Map();
  const queue = roots.map(r => ({ id: r.id, level: 0 }));
  while (queue.length) {
    const { id, level } = queue.shift()!;
    if (levels.has(id)) continue;
    levels.set(id, level);
    edges.filter(e => e.source === id)
      .forEach(e => queue.push({ id: e.target, level: level + 1 }));
  }
  // Assign unconnected nodes to level 0
  nodes.forEach(n => { if (!levels.has(n.id)) levels.set(n.id, 0); });

  // Position nodes by level
  const levelGroups: Map<number, string[]> = new Map();
  levels.forEach((lvl, id) => {
    if (!levelGroups.has(lvl)) levelGroups.set(lvl, []);
    levelGroups.get(lvl)!.push(id);
  });

  const HGAP = 220;  // horizontal gap between nodes
  const VGAP = 160;  // vertical gap between levels
  const updated = nodes.map(node => {
    const lvl = levels.get(node.id) ?? 0;
    const group = levelGroups.get(lvl) ?? [];
    const idx = group.indexOf(node.id);
    const totalWidth = group.length * HGAP;
    return {
      ...node,
      position: {
        x: idx * HGAP - totalWidth / 2,
        y: lvl * VGAP
      }
    };
  });
  return updated;
}
