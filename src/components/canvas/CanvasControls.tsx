import React from 'react';
import { Plus, Minus, Maximize, Grid3X3 } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';

export const CanvasControls: React.FC = () => {
  const { isGridEnabled, toggleGrid, zoomLevel, setZoomLevel } = useCanvasStore();

  return (
    <div className="absolute bottom-6 left-6 flex items-center gap-2 z-30">
      <div className="glass-panel p-1 flex items-center gap-1">
        <button
          onClick={() => setZoomLevel(Math.max(0.1, zoomLevel - 0.1))}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-fog hover:text-cloud"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-10 text-center text-[11px] font-mono font-medium">
          {Math.round(zoomLevel * 100)}%
        </div>
        <button
          onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
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
        className="glass-panel p-2.5 text-fog hover:text-cloud"
        aria-label="Fit view"
      >
        <Maximize className="w-4 h-4" />
      </button>
    </div>
  );
};
