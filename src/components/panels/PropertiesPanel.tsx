import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { Settings2 } from 'lucide-react';
import { ColourPicker } from './ColourPicker';
import { EdgePropertiesPanel } from './EdgePropertiesPanel';

export const PropertiesPanel: React.FC = () => {
  const { nodes, edges, selectedNodeIds, selectedEdgeIds } = useCanvasStore();
  const selectedNode = nodes.find((n) => selectedNodeIds.includes(n.id));
  const selectedEdge = edges.find((e) => selectedEdgeIds.includes(e.id));

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-64 h-full glass-panel border-y-0 border-r-0 rounded-none flex flex-col z-40">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-accent" />
          <h2 className="font-sora font-semibold text-[13px] uppercase tracking-wider text-text">Properties</h2>
        </div>
        <div className="p-4 flex flex-col gap-6 overflow-y-auto flex-1 min-h-0">
          <div className="text-center py-10 text-text-muted text-[11px]">
            Select an element to edit its properties
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 h-full glass-panel border-y-0 border-r-0 rounded-none flex flex-col z-40">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-accent" />
        <h2 className="font-sora font-semibold text-[13px] uppercase tracking-wider text-text">Properties</h2>
      </div>

      <div className="p-4 flex flex-col gap-6 overflow-y-auto flex-1 min-h-0">
        {selectedNode ? <ColourPicker mode="node" /> : <EdgePropertiesPanel />}
      </div>
    </div>
  );
};
