import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';

export const PenToolbar: React.FC = () => {
  const { currentTool, penColor, setPenColor, penWidth, setPenWidth } = useCanvasStore();

  if (currentTool !== 'draw' && currentTool !== 'eraser') return null;

  const colors = [
    '#E2E8F0', '#6366F1', '#34D399', '#F87171',
    '#FBBF24', '#EC4899', '#22D3EE', '#000000'
  ];

  const widths = [
    { label: 'Thin', value: 2 },
    { label: 'Medium', value: 4 },
    { label: 'Thick', value: 8 },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 glass-panel flex items-center gap-8 z-50 rounded-full shadow-2xl">
      <div className="flex items-center gap-2 pr-6 border-r border-border/50">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setPenColor(color)}
            className={`w-6 h-6 rounded-full border border-white/10 transition-all hover:scale-125 ${
              penColor === color ? 'ring-2 ring-accent ring-offset-2 ring-offset-[#1C1E26]' : ''
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
        <div className="relative w-6 h-6 rounded-full border border-white/10 overflow-hidden hover:scale-125 transition-all">
          <input
            type="color"
            value={penColor}
            onChange={(e) => setPenColor(e.target.value)}
            className="absolute -top-1 -left-1 w-[150%] h-[150%] cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {widths.map((width) => (
          <button
            key={width.value}
            onClick={() => setPenWidth(width.value)}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              penWidth === width.value ? 'text-accent' : 'text-text-muted hover:text-text'
            }`}
          >
            <div
              className={`rounded-full bg-current transition-all ${
                penWidth === width.value ? 'scale-110' : 'hover:scale-110'
              }`}
              style={{ width: width.value + 4, height: width.value + 4 }}
            />
            <span className="text-[10px] font-bold uppercase tracking-widest">{width.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
