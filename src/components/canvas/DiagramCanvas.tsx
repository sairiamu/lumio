import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow
} from '@xyflow/react';
import { useCanvasStore } from '../../store/canvasStore';
import { RectNode } from '../nodes/RectNode';
import { CircleNode } from '../nodes/CircleNode';
import { DiamondNode } from '../nodes/DiamondNode';
import { CardNode } from '../nodes/CardNode';
import { TextNode } from '../nodes/TextNode';

const nodeTypes = {
  rect: RectNode,
  circle: CircleNode,
  diamond: DiamondNode,
  card: CardNode,
  text: TextNode,
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
    shapeStyle
  } = useCanvasStore();

  const { screenToFlowPosition } = useReactFlow();

  const onPaneClick = useCallback((event: React.MouseEvent) => {
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
  }, [currentTool, nodes, setNodes, screenToFlowPosition]);

  const rfStyle = useMemo(() => ({
    backgroundColor: 'transparent',
  }), []);

  return (
    <div className="relative w-full h-full">
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <p className="text-fog font-sans text-sm animate-pulse">
            Click a shape in the toolbar to get started
          </p>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onPaneClick={onPaneClick}
        style={rfStyle}
        colorMode="dark"
        nodesDraggable={canvasMode === 'diagram'}
        nodesConnectable={canvasMode === 'diagram'}
        elementsSelectable={canvasMode === 'diagram'}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={isGridEnabled ? 'rgba(255,255,255,0.05)' : 'transparent'}
        />
      </ReactFlow>
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
