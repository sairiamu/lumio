import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { Settings2 } from 'lucide-react';
import { ColourPicker } from './ColourPicker';

export const PropertiesPanel: React.FC = () => {
  const { nodes, selectedNodeIds } = useCanvasStore();
  const selectedNode = nodes.find((n) => selectedNodeIds.includes(n.id));

  if (!selectedNode) {
    return (
      <div className="w-64 glass-panel border-y-0 border-r-0 rounded-none flex flex-col z-40">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-iris" />
          <h2 className="font-sora font-semibold text-[13px] uppercase tracking-wider">Properties</h2>
        </div>
        <div className="p-4 flex flex-col gap-6 overflow-y-auto">
          <div className="text-center py-10 text-fog text-[11px]">
            Select an element to edit its properties
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 glass-panel border-y-0 border-r-0 rounded-none flex flex-col z-40">
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-iris" />
        <h2 className="font-sora font-semibold text-[13px] uppercase tracking-wider">Properties</h2>
      </div>

      <div className="p-4 flex flex-col gap-6 overflow-y-auto">
        <ColourPicker />
      </div>
    </div>
  );
};
