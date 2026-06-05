import React from 'react';
import { Minus, Square, X, Hexagon, Palette } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useCanvasStore } from '../../store/canvasStore';

export const TitleBar: React.FC = () => {
  const { setThemePickerOpen, isThemePickerOpen } = useCanvasStore();
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
        <Hexagon className="w-5 h-5 text-accent fill-accent-light" />
        <span className="font-sora font-bold text-sm tracking-tight text-text">VibePlan</span>
      </div>

      <div className="flex items-center -mr-2">
        <button
          onClick={() => setThemePickerOpen(!isThemePickerOpen)}
          className={`p-2 hover:bg-white/10 transition-colors mr-2 rounded-lg ${isThemePickerOpen ? 'text-accent' : 'text-text-muted'}`}
          aria-label="Theme Picker"
        >
          <Palette className="w-4 h-4" />
        </button>
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
          className="p-2 hover:bg-danger/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
