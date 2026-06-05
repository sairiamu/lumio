import React from 'react';
import {
  MousePointer2,
  Square,
  Circle,
  Diamond,
  Type,
  CreditCard,
  Pencil,
  Eraser,
  Download,
  LayoutGrid
} from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { ToolButton } from './ToolButton';
import { ToolType } from '../../types';

export const ToolBar: React.FC = () => {
  const {
    currentTool,
    setCurrentTool,
    setExportModalOpen,
    isShapeLibraryOpen,
    setIsShapeLibraryOpen
  } = useCanvasStore();

  const tools: { type: ToolType; icon: any; label: string; shortcut: string }[] = [
    { type: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
    { type: 'rect', icon: Square, label: 'Rectangle', shortcut: 'R' },
    { type: 'circle', icon: Circle, label: 'Circle', shortcut: 'C' },
    { type: 'diamond', icon: Diamond, label: 'Diamond', shortcut: 'D' },
    { type: 'text', icon: Type, label: 'Text', shortcut: 'T' },
    { type: 'card', icon: CreditCard, label: 'Card', shortcut: 'K' },
    { type: 'draw', icon: Pencil, label: 'Draw', shortcut: 'P' },
    { type: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
  ];

  return (
    <div className="w-14 glass-panel border-y-0 border-l-0 rounded-none flex flex-col items-center py-4 gap-2 z-40">
      <div className="flex-1 flex flex-col gap-2">
        {tools.map((tool) => (
          <ToolButton
            key={tool.type}
            icon={tool.icon}
            label={tool.label}
            shortcut={tool.shortcut}
            isActive={currentTool === tool.type}
            onClick={() => {
              setCurrentTool(tool.type);
              setIsShapeLibraryOpen(false);
            }}
          />
        ))}

        <div className="mt-2 pt-2 border-t border-border w-full flex flex-col items-center gap-2">
          <ToolButton
            icon={LayoutGrid}
            label="Shape Library"
            shortcut="L"
            isActive={isShapeLibraryOpen}
            onClick={() => setIsShapeLibraryOpen(!isShapeLibraryOpen)}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border w-full flex flex-col items-center">
        <ToolButton
          icon={Download}
          label="Export"
          shortcut="Ctrl+E"
          isActive={false}
          onClick={() => setExportModalOpen(true)}
        />
      </div>
    </div>
  );
};
