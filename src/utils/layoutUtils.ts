import { Node, Edge } from '@xyflow/react';
import { layoutEngine, XYFlowAdapter } from '../lib/layout-engine';
import { NodeData, EdgeData } from '../types';
import { LAYOUT_CONFIG, LAYOUT_PRESETS, LayoutPresetType } from '../config/layoutConfig';

/**
 * Modern auto-layout utility using the Lumio Layout Engine.
 * Preserves semantic relationships and node metadata.
 */
export function autoLayout(
  nodes: Node<NodeData>[],
  edges: Edge<EdgeData>[],
  direction: 'LR' | 'TB' = 'LR',
  presetName: LayoutPresetType = 'architecture-flow'
): Node<NodeData>[] {
  const preset = LAYOUT_PRESETS[presetName] || LAYOUT_PRESETS['architecture-flow'];
  const finalDir = presetName === 'top-down' ? 'TB' : direction;

  // 1. Convert to internal layout graph
  const layoutGraph = XYFlowAdapter.toLayoutGraph(nodes, edges);

  // 2. Apply layout strategy
  const updates = layoutEngine.applyLayout(layoutGraph, 'hierarchical', {
    direction: finalDir,
    nodeSpacing: preset.nodeSpacing,
    levelSpacing: preset.levelSpacing,
    componentSpacing: preset.componentSpacing,
    useSemanticWeights: true
  });

  // 3. Apply updates back to XYFlow nodes
  return XYFlowAdapter.applyUpdates(nodes, updates);
}

/**
 * Auto-layout utility that organizes only the currently selected nodes.
 * Preserves external connections and ensures no overlaps with unselected nodes.
 */
export function autoLayoutSelected(
  nodes: Node<NodeData>[],
  edges: Edge<EdgeData>[],
  selectedIds: string[],
  direction: 'LR' | 'TB' = 'LR',
  presetName: LayoutPresetType = 'architecture-flow'
): Node<NodeData>[] {
  if (!selectedIds || selectedIds.length === 0) return nodes;

  const preset = LAYOUT_PRESETS[presetName] || LAYOUT_PRESETS['architecture-flow'];
  const finalDir = presetName === 'top-down' ? 'TB' : direction;

  const selectedNodes = nodes.filter(n => selectedIds.includes(n.id));
  const unselectedNodes = nodes.filter(n => !selectedIds.includes(n.id));

  if (selectedNodes.length === 0) return nodes;

  // Build a layout graph for ONLY the selected nodes and edges between them
  const selectedEdges = edges.filter(e => selectedIds.includes(e.source) && selectedIds.includes(e.target));
  const layoutGraph = XYFlowAdapter.toLayoutGraph(selectedNodes, selectedEdges);

  // Apply layout strategy on the selected subgraph
  const updates = layoutEngine.applyLayout(layoutGraph, 'hierarchical', {
    direction: finalDir,
    nodeSpacing: preset.nodeSpacing,
    levelSpacing: preset.levelSpacing,
    componentSpacing: preset.componentSpacing,
    useSemanticWeights: true
  });

  if (updates.length === 0) return nodes;

  // Calculate centers to find translation adjustment
  const oldCenter = { x: 0, y: 0 };
  selectedNodes.forEach(n => {
    oldCenter.x += n.position.x;
    oldCenter.y += n.position.y;
  });
  oldCenter.x /= selectedNodes.length;
  oldCenter.y /= selectedNodes.length;

  const newCenter = { x: 0, y: 0 };
  updates.forEach(u => {
    newCenter.x += u.x;
    newCenter.y += u.y;
  });
  newCenter.x /= updates.length;
  newCenter.y /= updates.length;

  let dx = oldCenter.x - newCenter.x;
  let dy = oldCenter.y - newCenter.y;

  // Refine dx, dy to preserve external connections if they exist
  const externalEdges = edges.filter(e =>
    (selectedIds.includes(e.source) && !selectedIds.includes(e.target)) ||
    (!selectedIds.includes(e.source) && selectedIds.includes(e.target))
  );

  if (externalEdges.length > 0) {
    let totalTargetX = 0;
    let totalTargetY = 0;
    let count = 0;

    externalEdges.forEach(e => {
      const isSourceSelected = selectedIds.includes(e.source);
      const selNodeId = isSourceSelected ? e.source : e.target;
      const unselNodeId = isSourceSelected ? e.target : e.source;

      const unselNode = unselectedNodes.find(n => n.id === unselNodeId);
      const layoutUpdate = updates.find(u => u.id === selNodeId);

      if (unselNode && layoutUpdate) {
        totalTargetX += (unselNode.position.x - layoutUpdate.x);
        totalTargetY += (unselNode.position.y - layoutUpdate.y);
        count++;
      }
    });

    if (count > 0) {
      const connectionDx = totalTargetX / count;
      const connectionDy = totalTargetY / count;
      // Blend 60% connection proximity and 40% original center
      dx = connectionDx * 0.6 + dx * 0.4;
      dy = connectionDy * 0.6 + dy * 0.4;
    }
  }

  const finalUpdates = updates.map(u => ({
    id: u.id,
    x: u.x + dx,
    y: u.y + dy
  }));

  // Resolve overlaps with unselected nodes
  for (let pass = 0; pass < 3; pass++) {
    let adjusted = false;
    for (const uUp of finalUpdates) {
      const sNode = selectedNodes.find(n => n.id === uUp.id);
      const sWidth = sNode?.measured?.width || 150;
      const sHeight = sNode?.measured?.height || 80;

      for (const unsel of unselectedNodes) {
        const uWidth = unsel.measured?.width || 150;
        const uHeight = unsel.measured?.height || 80;

        const minX1 = uUp.x, maxX1 = uUp.x + sWidth;
        const minY1 = uUp.y, maxY1 = uUp.y + sHeight;
        const minX2 = unsel.position.x, maxX2 = unsel.position.x + uWidth;
        const minY2 = unsel.position.y, maxY2 = unsel.position.y + uHeight;

        const overlapX = Math.min(maxX1, maxX2) - Math.max(minX1, minX2);
        const overlapY = Math.min(maxY1, maxY2) - Math.max(minY1, minY2);

        if (overlapX > 0 && overlapY > 0) {
          if (overlapX < overlapY) {
            const pushX = uUp.x + sWidth / 2 > unsel.position.x + uWidth / 2 ? overlapX + preset.componentSpacing - preset.nodeSpacing : -overlapX - (preset.componentSpacing - preset.nodeSpacing);
            uUp.x += pushX;
          } else {
            const pushY = uUp.y + sHeight / 2 > unsel.position.y + uHeight / 2 ? overlapY + preset.componentSpacing - preset.nodeSpacing : -overlapY - (preset.componentSpacing - preset.nodeSpacing);
            uUp.y += pushY;
          }
          adjusted = true;
        }
      }
    }
    if (!adjusted) break;
  }

  const updateMap = new Map(finalUpdates.map(u => [u.id, u]));
  return nodes.map(node => {
    const update = updateMap.get(node.id);
    if (update) {
      return {
        ...node,
        position: { x: update.x, y: update.y }
      };
    }
    return node;
  });
}
