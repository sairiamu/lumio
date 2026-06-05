import { useCanvasStore } from '../store/canvasStore';

export const useTrackedRelations = () => {
  const trackedNodeId = useCanvasStore((s) => s.trackedNodeId);
  const edges = useCanvasStore((s) => s.edges);
  const nodes = useCanvasStore((s) => s.nodes);

  if (!trackedNodeId) {
    return { glowNodeIds: [], glowEdgeIds: [], edgeColourMap: {}, trackedNodeId: null };
  }

  // find all edges connected to tracked node
  const connectedEdges = edges.filter(
    (e) => e.source === trackedNodeId || e.target === trackedNodeId
  );

  // find all node ids on the other end
  const connectedNodeIds = connectedEdges.map((e) =>
    e.source === trackedNodeId ? e.target : e.source
  );

  // map each edge to a glow colour based on its index
  // use a rotating palette so each relation has a distinct colour
  const glowPalette = [
    '#6366F1',
    '#34D399',
    '#F59E0B',
    '#EC4899',
    '#22D3EE',
    '#F87171',
    '#A78BFA',
  ];
  const edgeColourMap: Record<string, string> = {};
  connectedEdges.forEach((e, i) => {
    edgeColourMap[e.id] = e.data?.strokeColor || glowPalette[i % glowPalette.length];
  });

  return {
    glowNodeIds: [trackedNodeId, ...connectedNodeIds],
    glowEdgeIds: connectedEdges.map((e) => e.id),
    edgeColourMap,
    trackedNodeId,
  };
};
