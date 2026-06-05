import React from 'react';
import { useViewport } from '@xyflow/react';
import { useCanvasStore } from '../../store/canvasStore';
import { Layers, Maximize, MousePointer2, Pencil } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { nodes, canvasMode, trackedNodeId } = useCanvasStore();
  const { zoom } = useViewport();
  const displayZoom = Math.round((zoom ?? 1) * 100);

  return (
    <div className="h-6 glass-panel border-x-0 border-b-0 rounded-none flex items-center justify-between px-3 text-[10px] text-text-muted select-none z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {canvasMode === 'diagram' ? (
            <MousePointer2 className="w-3 h-3 text-accent" />
          ) : (
            <Pencil className="w-3 h-3 text-accent" />
          )}
          <span className="capitalize">{canvasMode} Mode</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3" />
          <span>{nodes.length} Elements</span>
        </div>
      </div>

      {trackedNodeId && (
        <div className="absolute left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent text-white rounded-full font-semibold flex items-center gap-2 shadow-lg border border-white/10 animate-in fade-in zoom-in duration-200">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span>Tracking Relations — Press Esc to clear</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Maximize className="w-3 h-3" />
          <span>{displayZoom}%</span>
        </div>
      </div>
    </div>
  );
};
