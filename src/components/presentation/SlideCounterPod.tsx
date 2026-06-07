import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';

export const SlideCounterPod: React.FC = () => {
  const { currentStep, stepNodes } = useCanvasStore();

  return (
    <div className="flex items-center gap-3 bg-panel backdrop-blur-xl border border-border rounded-[50px] py-1.5 px-4 shadow-2xl">
      <span className="text-[10px] font-inter font-bold text-text-muted uppercase tracking-widest">
        Slide
      </span>
      <div className="flex items-center text-text font-sora">
        <span className="text-lg font-bold">{currentStep + 1}</span>
        <span className="mx-1 text-text-muted text-sm">/</span>
        <span className="text-text-muted text-sm">{stepNodes.length}</span>
      </div>
    </div>
  );
};
