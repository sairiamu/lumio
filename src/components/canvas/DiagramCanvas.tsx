import React, { useMemo, useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  MarkerType,
  MiniMap
} from '@xyflow/react';
import { useCanvasStore } from '../../store/canvasStore';
import { RectNode } from '../nodes/RectNode';
import { CircleNode } from '../nodes/CircleNode';
import { DiamondNode } from '../nodes/DiamondNode';
import { CardNode } from '../nodes/CardNode';
import { TextNode } from '../nodes/TextNode';
import { UniversalNode } from '../nodes/UniversalNode';
import { GroupNode } from '../nodes/GroupNode';
import { CustomEdge } from './CustomEdge';
import ContextMenu from './ContextMenu';

const nodeTypes = {
  rect: RectNode,
  circle: CircleNode,
  diamond: DiamondNode,
  card: CardNode,
  text: TextNode,
  universal: UniversalNode,
  group: GroupNode,
};

const edgeTypes = {
  default: CustomEdge,
  smoothstep: CustomEdge,
  straight: CustomEdge,
};

const DiagramCanvasInner: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isGridEnabled,
    gridStyle,
    canvasMode,
    currentTool,
    pendingNodeType,
    pendingNodeTitle,
    setCurrentTool,
    setNodes,
    setSelectedNodeIds,
    setSelectedEdgeIds,
    setIsPanelOpen,
    deselectAll,
    shapeStyle,
    currentTheme,
    pushHistory,
    setTrackedNodeId,
    setAlignmentGuides,
    isMinimapOpen
  } = useCanvasStore();

  const isDark = currentTheme !== 'arctic';

  const styledEdges = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      type: edge.data?.pathType === 'default' ? undefined : edge.data?.pathType,
      style: {
        stroke: edge.data?.strokeColor || 'var(--text-muted)',
        strokeWidth: edge.data?.strokeWidth || 2,
        strokeDasharray:
          edge.data?.strokeStyle === 'dashed' ? '8 4' :
          edge.data?.strokeStyle === 'dotted' ? '2 4' :
          undefined,
      },
      markerStart: edge.data?.lineStart === 'arrow' ? { type: MarkerType.ArrowClosed, color: edge.data?.strokeColor || 'var(--text-muted)' } :
                  edge.data?.lineStart === 'circle' ? { type: MarkerType.Circle, color: edge.data?.strokeColor || 'var(--text-muted)' } : undefined,
      markerEnd: edge.data?.lineEnd === 'arrow' ? { type: MarkerType.ArrowClosed, color: edge.data?.strokeColor || 'var(--text-muted)' } :
                edge.data?.lineEnd === 'circle' ? { type: MarkerType.Circle, color: edge.data?.strokeColor || 'var(--text-muted)' } : undefined,
      animated: edge.data?.animated || false,
    }));
  }, [edges]);

  const { screenToFlowPosition } = useReactFlow();

  // Context menu state
  const [ctxVisible, setCtxVisible] = useState(false);
  const [ctxX, setCtxX] = useState(0);
  const [ctxY, setCtxY] = useState(0);
  const [ctxTargetNodeId, setCtxTargetNodeId] = useState<string | null>(null);

  const closeContextMenu = useCallback(() => {
    setCtxVisible(false);
    setCtxTargetNodeId(null);
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
    event.preventDefault();

    // Select the node if it's not already selected
    const isSelected = nodes.find(n => n.id === node.id)?.selected;
    if (!isSelected) {
      const updatedNodes = nodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }));
      setNodes(updatedNodes);
      setSelectedNodeIds([node.id]);
    }

    setCtxX(event.clientX);
    setCtxY(event.clientY);
    setCtxTargetNodeId(node.id);
    setCtxVisible(true);
  }, [nodes, setNodes, setSelectedNodeIds]);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setCtxX(event.clientX);
    setCtxY(event.clientY);
    setCtxTargetNodeId(null);
    setCtxVisible(true);
  }, []);

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    deselectAll();
    setIsPanelOpen(false);
    setTrackedNodeId(null);

    const shapeTools = ['rect', 'circle', 'diamond', 'card', 'text'];
    if (shapeTools.includes(currentTool)) {
      pushHistory();
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type: currentTool,
        position,
        data: {
          title: '',
          parameters: [],
          description: '',
          clayColor: currentTool === 'text' ? 'transparent' : 'var(--accent-light)'
        },
      };

      setNodes([...nodes, newNode]);
    } else if (currentTool === 'place' && pendingNodeType) {
      pushHistory();
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type: 'universal',
        position,
        data: {
          title: pendingNodeTitle || '',
          shapeType: pendingNodeType,
          parameters: [],
          description: '',
          clayColor: 'var(--accent-light)'
        },
      };

      setNodes([...nodes, newNode]);
      setCurrentTool('select');
    }
  }, [currentTool, pendingNodeType, pendingNodeTitle, nodes, setNodes, screenToFlowPosition, deselectAll, setIsPanelOpen, setCurrentTool, pushHistory, setTrackedNodeId]);

  const onSelectionChange = useCallback(({ nodes, edges }: { nodes: any[]; edges: any[] }) => {
    if (nodes.length > 0 || edges.length > 0) {
      setIsPanelOpen(true);
    } else {
      setIsPanelOpen(false);
    }
  }, [setIsPanelOpen]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: any) => {
    setIsPanelOpen(true);
  }, [setIsPanelOpen]);

  const onNodeDragStart = useCallback(() => {
    pushHistory();
  }, [pushHistory]);

  const onNodeDrag = useCallback((_: any, draggedNode: any) => {
    const SNAP_THRESHOLD = 8;
    const guides: { x?: number; y?: number } = {};

    nodes.forEach(n => {
      if (n.id === draggedNode.id) return;
      const dx = draggedNode.position.x - n.position.x;
      const dy = draggedNode.position.y - n.position.y;
      if (Math.abs(dx) < SNAP_THRESHOLD) guides.x = n.position.x;
      if (Math.abs(dy) < SNAP_THRESHOLD) guides.y = n.position.y;
    });
    setAlignmentGuides(guides);
  }, [nodes, setAlignmentGuides]);

  const onNodeDragStop = useCallback(() => {
    setAlignmentGuides({});
  }, [setAlignmentGuides]);

  const onSelectionDragStart = useCallback(() => {
    pushHistory();
  }, [pushHistory]);

  const rfStyle = useMemo(() => ({
    backgroundColor: 'transparent',
  }), []);

  return (
    <div className="relative w-full h-full">
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <p className="text-text-muted font-sans text-sm animate-pulse">
            Click a shape in the toolbar to get started
          </p>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onSelectionChange={onSelectionChange}
        onEdgeClick={onEdgeClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onSelectionDragStart={onSelectionDragStart}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onPaneClick={onPaneClick}
        style={rfStyle}
        colorMode={isDark ? 'dark' : 'light'}
        nodesDraggable={canvasMode === 'diagram'}
        nodesConnectable={canvasMode === 'diagram'}
        elementsSelectable={canvasMode === 'diagram'}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        panOnDrag={true}
        preventScrolling={true}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        {isGridEnabled && (
          <>
            {gridStyle === 'dots' && (
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--grid-color)" />
            )}
            {gridStyle === 'lines' && (
              <Background variant={BackgroundVariant.Lines} gap={16} color="var(--grid-color)" />
            )}
            {gridStyle === 'crosshatch' && (
              <>
                <Background variant={BackgroundVariant.Lines} gap={16} color="var(--grid-color)" />
                <Background
                  variant={BackgroundVariant.Lines}
                  gap={16}
                  color="var(--grid-color)"
                  style={{ transform: 'rotate(90deg)' }}
                />
              </>
            )}
          </>
        )}
        {isMinimapOpen && (
          <MiniMap
            nodeColor={(node) => (node.data as any)?.clayColor || 'var(--accent)'}
            maskColor="rgba(15,17,23,0.8)"
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: 12,
            }}
          />
        )}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
          <defs>
            <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </ReactFlow>
      <ContextMenu visible={ctxVisible} x={ctxX} y={ctxY} targetNodeId={ctxTargetNodeId} onClose={closeContextMenu} />
    </div>
  );
};

export const DiagramCanvas: React.FC = () => {
  return (
    <div className="w-full h-full">
      <DiagramCanvasInner />
    </div>
  );
};
