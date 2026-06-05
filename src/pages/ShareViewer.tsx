import React, { useEffect, useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { decodeShareURL } from '../utils/shareUtils';
import { Node, Edge } from '@xyflow/react';
import { RectNode } from '../components/nodes/RectNode';
import { CircleNode } from '../components/nodes/CircleNode';
import { DiamondNode } from '../components/nodes/DiamondNode';
import { CardNode } from '../components/nodes/CardNode';
import { TextNode } from '../components/nodes/TextNode';
import { UniversalNode } from '../components/nodes/UniversalNode';
import { CustomEdge } from '../components/canvas/CustomEdge';
import { useTheme } from '../hooks/useTheme';

const nodeTypes = {
  rect: RectNode,
  circle: CircleNode,
  diamond: DiamondNode,
  card: CardNode,
  text: TextNode,
  universal: UniversalNode,
};

const edgeTypes = {
  default: CustomEdge,
  smoothstep: CustomEdge,
  straight: CustomEdge,
};

const ShareViewerInner: React.FC = () => {
  const [data, setData] = useState<{ nodes: Node[], edges: Edge[] } | null>(null);
  useTheme(); // Apply theme CSS variables

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // The hash might be #share=[data] or just #[data]
      // Our shareUtils.ts handles removing # if present
      const decoded = decodeShareURL(hash);
      if (decoded) {
        setData(decoded);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#1C1E26] text-text gap-4">
        <img src="/vibeplan.svg" alt="VibePlan" className="w-16 h-16 animate-pulse" />
        <h1 className="text-xl font-sora font-bold">Invalid or Empty Share Link</h1>
        <button
          onClick={() => window.location.href = '/'}
          className="text-accent hover:underline text-sm"
        >
          Go to VibePlan Editor
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-canvas relative">
      <ReactFlow
        nodes={data.nodes}
        edges={data.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--grid-color)" />
      </ReactFlow>

      {/* Overlay UI */}
      <div className="absolute top-6 left-6 flex items-center gap-3 pointer-events-none">
        <img src="/vibeplan.svg" alt="VibePlan" className="w-8 h-8" />
        <div>
          <h1 className="text-lg font-sora font-bold text-text leading-none">VibePlan</h1>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Read-Only View</p>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => window.location.href = '/'}
          className="bg-accent hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-bold shadow-2xl transition-all transform active:scale-[0.98] flex items-center gap-2 cursor-pointer"
        >
          Open in VibePlan
        </button>
      </div>
    </div>
  );
};

export const ShareViewer: React.FC = () => {
  return (
    <ReactFlowProvider>
      <ShareViewerInner />
    </ReactFlowProvider>
  );
};
