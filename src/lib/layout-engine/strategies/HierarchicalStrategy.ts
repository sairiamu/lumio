import { LayoutGraph, PositionUpdate, LayoutOptions, ILayoutStrategy, LayoutStrategyType } from '../types';
import { BaseStrategy } from './BaseStrategy';

export class HierarchicalStrategy extends BaseStrategy implements ILayoutStrategy {
  type: LayoutStrategyType = 'hierarchical';

  calculate(graph: LayoutGraph, options: LayoutOptions = {}): PositionUpdate[] {
    if (graph.nodes.length === 0) return [];

    const {
      direction = 'LR',
      nodeSpacing = 80,
    } = options;

    // 1. Detect disconnected graph components
    // We treat groups as atomic units in the top-level layout, then layout children inside if needed
    const topLevelNodes = graph.nodes.filter(n => !n.parentId);
    const topLevelGraph = {
      nodes: topLevelNodes,
      edges: graph.edges.filter(e => {
        const sNode = graph.nodes.find(n => n.id === e.source);
        const tNode = graph.nodes.find(n => n.id === e.target);
        return sNode && tNode && !sNode.parentId && !tNode.parentId;
      })
    };

    const components = this.findConnectedComponents(topLevelGraph);

    const allUpdates: PositionUpdate[] = [];
    const isHorizontal = direction === 'LR' || direction === 'RL';

    let currentComponentOffset = 0;
    // Spacing between unrelated systems/components
    const compSpacing = options.componentSpacing ?? 120;

    components.forEach((compGraph) => {
      // Calculate layout for this component independently
      const compUpdates = this.calculateIndividualComponent(compGraph, options);
      if (compUpdates.length === 0) return;

      // Find bounding box of this component layout
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;

      compUpdates.forEach(u => {
        const node = compGraph.nodes.find(n => n.id === u.id)!;
        const w = node.width || 150;
        const h = node.height || 80;

        if (u.x < minX) minX = u.x;
        if (u.x + w > maxX) maxX = u.x + w;
        if (u.y < minY) minY = u.y;
        if (u.y + h > maxY) maxY = u.y + h;
      });

      // Normalize component updates so its top-left is at (0, 0)
      compUpdates.forEach(u => {
        u.x -= minX;
        u.y -= minY;
      });

      const compWidth = maxX - minX;
      const compHeight = maxY - minY;

      // Arrange components into clean groups.
      if (isHorizontal) {
        compUpdates.forEach(u => {
          u.y += currentComponentOffset;
        });
        currentComponentOffset += compHeight + compSpacing;
      } else {
        compUpdates.forEach(u => {
          u.x += currentComponentOffset;
        });
        currentComponentOffset += compWidth + compSpacing;
      }

      allUpdates.push(...compUpdates);
    });

    // 4. Handle child nodes in groups
    // Move children along with their parents while preserving relative layout.
    const updatesMap = new Map(allUpdates.map(u => [u.id, u]));
    const nodesMap = new Map(graph.nodes.map(n => [n.id, n]));

    graph.nodes.forEach(node => {
      if (node.parentId && !updatesMap.has(node.id)) {
        const parentUpdate = updatesMap.get(node.parentId);
        const parentNode = nodesMap.get(node.parentId);

        if (parentUpdate && parentNode) {
          const relX = node.x - parentNode.x;
          const relY = node.y - parentNode.y;

          const childUpdate = {
            id: node.id,
            x: parentUpdate.x + relX,
            y: parentUpdate.y + relY
          };
          allUpdates.push(childUpdate);
          updatesMap.set(node.id, childUpdate);
        }
      }
    });

    return allUpdates;
  }

    return allUpdates;
  }

  /**
   * Core hierarchical layout for a single connected component.
   */
  private calculateIndividualComponent(graph: LayoutGraph, options: LayoutOptions = {}): PositionUpdate[] {
    const {
      direction = 'LR',
      nodeSpacing = 80,
      levelSpacing = 150,
      useSemanticWeights = true
    } = options;

    if (graph.nodes.length === 0) return [];

    // 1. Deterministic Level Assignment
    const levels = this.assignLevels(graph, useSemanticWeights);
    const maxLevel = Math.max(0, ...Array.from(levels.values()));

    // 2. Group and Sort Nodes by Level (Crossing Reduction)
    const levelGroups = this.groupAndSortNodes(graph, levels, maxLevel);

    const updates: PositionUpdate[] = [];
    const isHorizontal = direction === 'LR' || direction === 'RL';

    // 3. Position Calculation
    const levelBreadths = new Map<number, number>();
    const levelDepths = new Map<number, number>();

    for (let l = 0; l <= maxLevel; l++) {
      const nodeIds = levelGroups.get(l) || [];
      const nodes = nodeIds.map(id => graph.nodes.find(n => n.id === id)!);

      let breadth = 0;
      let maxDepth = 0;

      nodes.forEach((n, idx) => {
        const nodeBreadth = isHorizontal ? n.height : n.width;
        const nodeDepth = isHorizontal ? n.width : n.height;

        breadth += nodeBreadth + (idx < nodes.length - 1 ? nodeSpacing : 0);
        maxDepth = Math.max(maxDepth, nodeDepth);
      });

      levelBreadths.set(l, breadth);
      levelDepths.set(l, maxDepth);
    }

    let currentDepthOffset = 0;

    for (let l = 0; l <= maxLevel; l++) {
      const nodeIds = levelGroups.get(l) || [];
      const nodes = nodeIds.map(id => graph.nodes.find(n => n.id === id)!);
      const totalBreadth = levelBreadths.get(l) || 0;
      const currentLevelDepth = levelDepths.get(l) || 0;

      let currentBreadthOffset = -totalBreadth / 2;

      nodes.forEach(node => {
        const nWidth = node.width || 150;
        const nHeight = node.height || 80;
        const nBreadth = isHorizontal ? nHeight : nWidth;

        let x: number, y: number;

        if (direction === 'LR') {
          x = currentDepthOffset;
          y = currentBreadthOffset;
        } else if (direction === 'RL') {
          x = -currentDepthOffset - nWidth;
          y = currentBreadthOffset;
        } else if (direction === 'BT') {
          x = currentBreadthOffset;
          y = -currentDepthOffset - nHeight;
        } else { // TB
          x = currentBreadthOffset;
          y = currentDepthOffset;
        }

        updates.push({ id: node.id, x, y });
        currentBreadthOffset += nBreadth + nodeSpacing;
      });

      currentDepthOffset += currentLevelDepth + levelSpacing;
    }

    return updates;
  }

  /**
   * Detects disconnected graph components using undirected BFS.
   */
  private findConnectedComponents(graph: LayoutGraph): LayoutGraph[] {
    const visited = new Set<string>();
    const components: LayoutGraph[] = [];

    // Build undirected adjacency list
    const adj = new Map<string, Set<string>>();
    graph.nodes.forEach(n => adj.set(n.id, new Set()));
    graph.edges.forEach(e => {
      if (adj.has(e.source) && adj.has(e.target)) {
        adj.get(e.source)!.add(e.target);
        adj.get(e.target)!.add(e.source);
      }
    });

    graph.nodes.forEach(node => {
      if (!visited.has(node.id)) {
        const compNodeIds = new Set<string>();
        const queue: string[] = [node.id];
        visited.add(node.id);

        while (queue.length > 0) {
          const curr = queue.shift()!;
          compNodeIds.add(curr);

          const neighbors = adj.get(curr) || new Set();
          neighbors.forEach(neighbor => {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          });
        }

        // Subgraph for component
        const compNodes = graph.nodes.filter(n => compNodeIds.has(n.id));
        const compEdges = graph.edges.filter(e => compNodeIds.has(e.source) && compNodeIds.has(e.target));
        components.push({ nodes: compNodes, edges: compEdges });
      }
    });

    return components;
  }

  private assignLevels(graph: LayoutGraph, useWeights: boolean): Map<string, number> {
    const levels = new Map<string, number>();
    const nodeCount = graph.nodes.length;

    // Semantic weights mapping
    const weights: Record<string, number> = {
      'user': 0,
      'client': 1,
      'api': 2,
      'service': 3,
      'database': 4,
      'storage': 4,
      'cache': 4,
      'queue': 4,
      'cloud_resource': 5,
      'external_system': 5,
      'generic': 2
    };

    // 1. Identify Components & Roots
    // Prioritize semantic roots (nodes not targeted by any semantic relationships)
    const semanticEdges = graph.edges.filter(e => e.semantic?.relationship && e.semantic.relationship !== 'generic');
    const semanticTargets = new Set(semanticEdges.map(e => e.target));

    let roots = this.getRoots(graph).sort();

    // If no natural roots (e.g. cycles), pick the node with fewest incoming edges
    if (roots.length === 0 && graph.nodes.length > 0) {
      const inDegrees = new Map<string, number>();
      graph.nodes.forEach(n => inDegrees.set(n.id, 0));
      graph.edges.forEach(e => inDegrees.set(e.target, (inDegrees.get(e.target) || 0) + 1));

      const bestRoot = Array.from(inDegrees.entries())
        .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))[0];

      if (bestRoot) roots = [bestRoot[0]];
    }

    // If a node is a visual target but NOT a semantic target, it's a stronger candidate for a root
    // in the context of "preferring meaningful relationships".
    const preferredRoots = roots.filter(r => !semanticTargets.has(r));
    if (preferredRoots.length > 0) {
      roots = preferredRoots;
    }

    // 2. BFS for connected components starting from roots
    const queue: { id: string, level: number }[] = roots.map(id => ({ id, level: 0 }));

    const RELATIONSHIP_STRENGTH: Record<string, number> = {
      'depends_on': 1,
      'calls': 1,
      'reads_from': 1,
      'writes_to': 1,
      'publishes_to': 1,
      'consumes_from': 1,
      'contains': 2,
      'connects_to': 1,
      'generic': 1
    };

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;

      // Prevent runaway cycles by capping levels at nodeCount * maxStrength
      if (level > nodeCount * 2) continue;

      const existingLevel = levels.get(id);

      if (existingLevel === undefined || level > existingLevel) {
        levels.set(id, level);

        // Sort children for determinism and potentially by relationship strength
        const edgesFromNode = graph.edges
          .filter(e => e.source === id)
          .sort((a, b) => a.target.localeCompare(b.target));

        edgesFromNode.forEach(edge => {
          const strength = RELATIONSHIP_STRENGTH[edge.semantic?.relationship || 'generic'] || 1;
          queue.push({ id: edge.target, level: level + strength });
        });
      }
    }

    // 3. Handle disconnected nodes or cycles using semantic weights
    graph.nodes.forEach(node => {
      if (!levels.has(node.id)) {
        let level = 0;
        if (useWeights && node.semantic?.category) {
          level = weights[node.semantic.category] ?? 2;
        }
        levels.set(node.id, level);
      }
    });

    return levels;
  }

  private groupAndSortNodes(
    graph: LayoutGraph,
    levels: Map<string, number>,
    maxLevel: number
  ): Map<number, string[]> {
    const groups = new Map<number, string[]>();

    // Initial grouping
    for (let l = 0; l <= maxLevel; l++) {
      const nodesInLevel = Array.from(levels.entries())
        .filter(([_, lvl]) => lvl === l)
        .map(([id, _]) => id)
        .sort(); // Initial deterministic sort
      groups.set(l, nodesInLevel);
    }

    // Barycenter Crossing Reduction (One pass TB)
    const RELATIONSHIP_WEIGHTS: Record<string, number> = {
      'depends_on': 2,
      'calls': 2,
      'reads_from': 1.5,
      'writes_to': 1.5,
      'publishes_to': 1.5,
      'consumes_from': 1.5,
      'contains': 3,
      'connects_to': 1.2,
      'generic': 1
    };

    for (let l = 1; l <= maxLevel; l++) {
      const currentLevel = groups.get(l) || [];
      const prevLevel = groups.get(l - 1) || [];
      const prevLevelOrder = new Map(prevLevel.map((id, index) => [id, index]));

      const barycenters = currentLevel.map(id => {
        const incomingEdges = graph.edges
          .filter(e => e.target === id && prevLevelOrder.has(e.source));

        let totalWeight = 0;
        let weightedSum = 0;

        incomingEdges.forEach(e => {
          const rel = e.semantic?.relationship || 'generic';
          const weight = RELATIONSHIP_WEIGHTS[rel] || 1;
          const pos = prevLevelOrder.get(e.source)!;

          weightedSum += pos * weight;
          totalWeight += weight;
        });

        const avg = totalWeight > 0 ? weightedSum / totalWeight : 0;

        return { id, avg };
      });

      // Sort current level by weighted barycenter
      const sorted = barycenters
        .sort((a, b) => a.avg - b.avg || a.id.localeCompare(b.id))
        .map(b => b.id);

      groups.set(l, sorted);
    }

    return groups;
  }
}
