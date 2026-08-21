import React from 'react';
import * as Lucide from 'lucide-react';
import { COMPONENT_LIBRARY } from '../../data/componentLibrary';
import { useCircuitStore } from '../../store/circuitStore';
import { useReactFlow } from '@xyflow/react';

export const ComponentPalette: React.FC = () => {
  const { addNode } = useCircuitStore();
  const { screenToFlowPosition } = useReactFlow();

  const handleAddComponent = (type: string) => {
    // Add to center of screen for now, or just offset from top-left
    const id = `${type}_${Date.now()}`;
    addNode({
      id,
      type,
      position: { x: 100, y: 100 },
      data: { type },
    });
  };

  return (
    <div className="fixed left-4 top-20 w-48 glass-panel flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-200 z-50">
      <div className="p-3 border-b border-white/10 bg-white/5">
        <h2 className="text-white font-semibold text-[11px] tracking-wider uppercase">Components</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 grid grid-cols-2 gap-2">
        {COMPONENT_LIBRARY.map((item) => {
          const Icon = (Lucide as any)[item.icon] || Lucide.Box;
          return (
            <button
              key={item.id}
              onClick={() => handleAddComponent(item.type)}
              className="group flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all hover:bg-white/10 border border-white/5 hover:border-indigo-500/40"
              title={item.label}
            >
              <div className="text-slate-400 group-hover:text-indigo-400">
                <Icon size={20} />
              </div>
              <span className="text-[9px] text-slate-500 group-hover:text-slate-200 truncate w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
