import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '@wokwi/elements';
import { useCircuitStore } from '../../store/circuitStore';
import { useCanvasStore } from '../../store/canvasStore';
import { ArduinoUnoNode } from '../nodes/circuit/ArduinoUnoNode';
import { LEDNode } from '../nodes/circuit/LEDNode';
import { ResistorNode } from '../nodes/circuit/ResistorNode';
import { PushbuttonNode } from '../nodes/circuit/PushbuttonNode';
import { PotentiometerNode } from '../nodes/circuit/PotentiometerNode';
import { BuzzerNode } from '../nodes/circuit/BuzzerNode';
import { ServoNode } from '../nodes/circuit/ServoNode';
import { BreadboardNode } from '../nodes/circuit/BreadboardNode';
import { WireEdge } from './WireEdge';

const nodeTypes = {
  'wokwi-arduino-uno': ArduinoUnoNode,
  'wokwi-led': LEDNode,
  'wokwi-resistor': ResistorNode,
  'wokwi-pushbutton': PushbuttonNode,
  'wokwi-potentiometer': PotentiometerNode,
  'wokwi-buzzer': BuzzerNode,
  'wokwi-servo': ServoNode,
  'wokwi-breadboard': BreadboardNode,
};

const edgeTypes = {
  wire: WireEdge,
};

export const CircuitCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useCircuitStore();

  const currentTheme = useCanvasStore((state) => state.currentTheme);
  const isDark = currentTheme === 'dark';

  const rfStyle = useMemo(() => ({
    backgroundColor: 'transparent',
  }), []);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes as any}
        edgeTypes={edgeTypes}
        style={rfStyle}
        colorMode={isDark ? 'dark' : 'light'}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--grid-color)" />
        <Panel position="top-right" className="bg-slate-900/50 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white text-[10px] font-mono">
          ELECTRICAL CANVAS FOUNDATION (ST6)
        </Panel>
      </ReactFlow>
    </div>
  );
};
