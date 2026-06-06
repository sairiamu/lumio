import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Maximize, Grid3X3, Undo2, Redo2, LayoutDashboard, Map, Square, Grip, Rows, Hash } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useReactFlow, useViewport, Node } from '@xyflow/react';
import { autoLayout } from '../../utils/layoutUtils';
import { NodeData } from '../../types';

export interface CanvasControlsProps {}

export const CanvasControls: React.FC<CanvasControlsProps> = () => {
  const {
    isGridEnabled,
    gridStyle,
    setGridStyle,
    toggleGrid,
    undo,
    redo,
    past,
    future,
    nodes,
    edges,
    setNodes,
    pushHistory,
    isMinimapOpen,
    toggleMinimap
  } = useCanvasStore();
  const { zoomIn, zoomOut, fitView, setViewport, getViewport } = useReactFlow();
  const { zoom } = useViewport();

  const [showGridOptions, setShowGridOptions] = useState(false);
  const gridButtonRef = useRef<HTMLDivElement>(null);

  const displayZoom = Math.round((zoom ?? 1) * 100);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gridButtonRef.current && !gridButtonRef.current.contains(event.target as globalThis.Node)) {
        setShowGridOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setNodes(laid as Node<NodeData>[]);
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
  };

  const handleGridContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowGridOptions(true);
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

      <div className="relative" ref={gridButtonRef}>
        <button
          onClick={toggleGrid}
          onContextMenu={handleGridContextMenu}
          className={`glass-panel p-2.5 transition-all ${isGridEnabled ? 'text-accent shadow-lg' : 'text-text-muted'}`}
          aria-label="Toggle grid"
          title="Right-click for grid styles"
        >
          <Grid3X3 className="w-4 h-4" />
        </button>

        {showGridOptions && (
          <div className="absolute bottom-full left-0 mb-2 glass-panel p-2 grid grid-cols-2 gap-2 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            {[
              { id: 'none', icon: Square, label: 'None' },
              { id: 'dots', icon: Grip, label: 'Dots' },
              { id: 'lines', icon: Rows, label: 'Lines' },
              { id: 'crosshatch', icon: Hash, label: 'Crosshatch' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setGridStyle(opt.id as any);
                  setShowGridOptions(false);
                  if (!isGridEnabled) toggleGrid();
                }}
                className={`p-2 rounded-lg transition-all flex items-center justify-center ${gridStyle === opt.id ? 'ring-2 ring-accent bg-accent/20' : 'hover:bg-white/10'}`}
                title={opt.label}
              >
                <opt.icon className="w-4 h-4 text-text" />
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleFitView}
        className="glass-panel p-2.5 text-text-muted hover:text-text"
        aria-label="Fit view"
      >
        <Maximize className="w-4 h-4" />
      </button>

      <button
        onClick={toggleMinimap}
        className={`glass-panel p-2.5 transition-all ${isMinimapOpen ? 'bg-accent text-white shadow-lg border-accent' : 'text-text-muted hover:text-text'}`}
        title="Toggle Minimap"
        aria-label="Toggle Minimap"
      >
        <Map className="w-4 h-4" />
      </button>
    </div>
  );
};
