import React from 'react';
import { Plus, Minus, Maximize, Grid3X3 } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useReactFlow, useViewport } from '@xyflow/react';

export const CanvasControls: React.FC = () => {
  const { isGridEnabled, toggleGrid } = useCanvasStore();
  const { zoomIn, zoomOut, fitView, setViewport, getViewport } = useReactFlow();
  const { zoom } = useViewport();

  const displayZoom = Math.round((zoom ?? 1) * 100);

  const handleFitView = () => {
    const viewport = getViewport();
    if (viewport) {
      fitView({ padding: 0.2, duration: 300 });
    } else {
      setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 0 });
    }
  };

  return (
    <div className="absolute bottom-6 left-6 flex items-center gap-2 z-30">
      <div className="glass-panel p-1 flex items-center gap-1">
        <button
          onClick={() => zoomOut({ duration: 200 })}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-fog hover:text-cloud"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-10 text-center text-[11px] font-mono font-medium">
          {displayZoom}%
        </div>
        <button
          onClick={() => zoomIn({ duration: 200 })}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-fog hover:text-cloud"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={toggleGrid}
        className={`glass-panel p-2.5 transition-all ${isGridEnabled ? 'text-iris shadow-[0_0_12px_rgba(99,102,241,0.3)]' : 'text-fog'}`}
        aria-label="Toggle grid"
      >
        <Grid3X3 className="w-4 h-4" />
      </button>

      <button
        onClick={handleFitView}
        className="glass-panel p-2.5 text-fog hover:text-cloud"
        aria-label="Fit view"
      >
        <Maximize className="w-4 h-4" />
      </button>
    </div>
  );
};
