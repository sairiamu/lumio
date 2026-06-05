import React, { useMemo, useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  MarkerType
} from '@xyflow/react';
import { useCanvasStore } from '../../store/canvasStore';
import { RectNode } from '../nodes/RectNode';
import { CircleNode } from '../nodes/CircleNode';
import { DiamondNode } from '../nodes/DiamondNode';
import { CardNode } from '../nodes/CardNode';
import { TextNode } from '../nodes/TextNode';
import { CustomEdge } from './CustomEdge';
import ContextMenu from './ContextMenu';

const nodeTypes = {
  rect: RectNode,
  circle: CircleNode,
  diamond: DiamondNode,
  card: CardNode,
  text: TextNode,
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
    canvasMode,
    currentTool,
    setNodes,
    setSelectedNodeIds,
    setSelectedEdgeIds,
    setIsPanelOpen,
    deselectAll,
    shapeStyle,
    currentTheme
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
    setCtxX(event.clientX);
    setCtxY(event.clientY);
    setCtxTargetNodeId(node.id);
    setCtxVisible(true);
  }, []);

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

    const shapeTools = ['rect', 'circle', 'diamond', 'card', 'text'];
    if (shapeTools.includes(currentTool)) {
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
          color: currentTool === 'rect' ? '#7EB8F7' :
                 currentTool === 'circle' ? '#B48EF7' :
                 currentTool === 'diamond' ? '#F7A97E' :
                 currentTool === 'card' ? '#6EDBB4' :
                 currentTool === 'text' ? 'transparent' : '#7EB8F7'
        },
      };

      setNodes([...nodes, newNode]);
    }
  }, [currentTool, nodes, setNodes, screenToFlowPosition, deselectAll, setIsPanelOpen]);

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
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={isGridEnabled ? 'var(--grid-color)' : 'transparent'}
        />
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
