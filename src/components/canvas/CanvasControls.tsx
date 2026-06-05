import React from 'react';
import { Plus, Minus, Maximize, Grid3X3, Undo2, Redo2, LayoutDashboard } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useReactFlow, useViewport } from '@xyflow/react';
import { autoLayout } from '../../utils/layoutUtils';

export interface CanvasControlsProps {}

export const CanvasControls: React.FC<CanvasControlsProps> = () => {
  const { isGridEnabled, toggleGrid, undo, redo, past, future, nodes, edges, setNodes, pushHistory } = useCanvasStore();
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

  const handleAutoLayout = () => {
    pushHistory();
    const laid = autoLayout(nodes, edges);
    setNodes(laid);
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
  };

  return (
    <div className="absolute bottom-6 left-6 flex items-center gap-2 z-30">
      <div className="glass-panel p-1 flex items-center gap-1">
        <button
          onClick={undo}
          disabled={past.length === 0}
          className={`p-1.5 rounded-md transition-colors ${past.length === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10 text-text-muted hover:text-text'}`}
          aria-label="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={future.length === 0}
          className={`p-1.5 rounded-md transition-colors ${future.length === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10 text-text-muted hover:text-text'}`}
          aria-label="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-panel p-1 flex items-center gap-1">
        <button
          onClick={() => zoomOut({ duration: 200 })}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-text-muted hover:text-text"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-10 text-center text-[11px] font-mono font-medium text-text">
          {displayZoom}%
        </div>
        <button
          onClick={() => zoomIn({ duration: 200 })}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-text-muted hover:text-text"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={handleAutoLayout}
        className="glass-panel p-2.5 text-text-muted hover:text-text"
        aria-label="Auto Layout"
      >
        <LayoutDashboard className="w-4 h-4" />
      </button>

      <button
        onClick={toggleGrid}
        className={`glass-panel p-2.5 transition-all ${isGridEnabled ? 'text-accent shadow-lg' : 'text-text-muted'}`}
        aria-label="Toggle grid"
      >
        <Grid3X3 className="w-4 h-4" />
      </button>

      <button
        onClick={handleFitView}
        className="glass-panel p-2.5 text-text-muted hover:text-text"
        aria-label="Fit view"
      >
        <Maximize className="w-4 h-4" />
      </button>
    </div>
  );
};
