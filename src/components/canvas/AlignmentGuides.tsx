import React from 'react';
import { useViewport } from '@xyflow/react';
import { useCanvasStore } from '../../store/canvasStore';

export interface AlignmentGuidesProps {}

export const AlignmentGuides: React.FC<AlignmentGuidesProps> = () => {
  const { alignmentGuides } = useCanvasStore();
  const { x: vX, y: vY, zoom } = useViewport();

  if (!alignmentGuides.x && !alignmentGuides.y) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {alignmentGuides.x !== undefined && (
        <div
          className="absolute top-0 bottom-0 w-[1px] bg-[#6366F1] opacity-80"
          style={{
            left: alignmentGuides.x * zoom + vX,
          }}
        />
      )}
      {alignmentGuides.y !== undefined && (
        <div
          className="absolute left-0 right-0 h-[1px] bg-[#6366F1] opacity-80"
          style={{
            top: alignmentGuides.y * zoom + vY,
          }}
        />
      )}
    </div>
  );
};
