import { LayoutGraph, PositionUpdate, LayoutOptions } from '../types';

export abstract class BaseStrategy {
  protected getRoots(graph: LayoutGraph): string[] {
    const targets = new Set(graph.edges.map(e => e.target));
    return graph.nodes
      .filter(n => !targets.has(n.id) && !n.parentId)
      .map(n => n.id);
  }

  protected getChildren(nodeId: string, graph: LayoutGraph): string[] {
    return graph.edges
      .filter(e => e.source === nodeId)
      .map(e => e.target);
  }

  protected getNodesInLevel(levels: Map<string, number>, level: number): string[] {
    const result: string[] = [];
    levels.forEach((lvl, id) => {
      if (lvl === level) result.push(id);
    });
    return result;
  }
}
