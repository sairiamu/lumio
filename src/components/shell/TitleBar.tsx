import React from 'react';
import { Minus, Square, X, Hexagon } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';

export const TitleBar: React.FC = () => {
  const handleMinimize = async () => {
    await getCurrentWindow().minimize();
  };

  const handleMaximize = async () => {
    await getCurrentWindow().toggleMaximize();
  };

  const handleClose = async () => {
    await getCurrentWindow().close();
  };

  return (
    <div
      className="h-10 glass-panel border-none rounded-none flex items-center justify-between px-4 select-none z-50 shrink-0"
      data-tauri-drag-region
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <Hexagon className="w-5 h-5 text-iris fill-iris/20" />
        <span className="font-sora font-bold text-sm tracking-tight">VibePlan</span>
      </div>

      <div className="flex items-center -mr-2">
        <button
          onClick={handleMinimize}
          className="p-2 hover:bg-white/10 transition-colors"
          aria-label="Minimize"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleMaximize}
          className="p-2 hover:bg-white/10 transition-colors"
          aria-label="Maximize"
        >
          <Square className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-ember/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
