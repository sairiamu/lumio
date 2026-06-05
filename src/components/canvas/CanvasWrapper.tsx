import React from 'react';
import { DiagramCanvas } from './DiagramCanvas';
import { FreehandCanvas } from './FreehandCanvas';
import { CanvasControls } from './CanvasControls';
import { ExportModal } from '../modals/ExportModal';
import { useCanvasStore } from '../../store/canvasStore';

export const CanvasWrapper: React.FC = () => {
  const { canvasMode } = useCanvasStore();

  return (
    <div className="w-full h-full relative bg-ash">
      {/* The diagram canvas is always present but its interaction might be limited when drawing */}
      <DiagramCanvas />

      {/* The freehand canvas sits on top */}
      <FreehandCanvas active={canvasMode === 'freehand'} />

      <CanvasControls />

      <ExportModal />
    </div>
  );
};
