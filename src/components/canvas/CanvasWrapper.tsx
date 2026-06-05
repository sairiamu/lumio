import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DiagramCanvas } from './DiagramCanvas';
import { FreehandCanvas } from './FreehandCanvas';
import { CanvasControls } from './CanvasControls';
import { AlignmentGuides } from './AlignmentGuides';
import { ExportModal } from '../modals/ExportModal';
import { ShareModal } from '../modals/ShareModal';
import { ShapeLibrary } from '../panels/ShapeLibrary';
import { useCanvasStore } from '../../store/canvasStore';

export const CanvasWrapper: React.FC = () => {
  const { canvasMode, isPresentationMode, stepNodes, currentStep, nextStep, prevStep } = useCanvasStore();

  return (
    <div className="w-full h-full relative bg-canvas">
      {/* The diagram canvas is always present but its interaction might be limited when drawing */}
      <DiagramCanvas />

      {/* The freehand canvas sits on top */}
      <FreehandCanvas active={canvasMode === 'freehand'} />

      <AlignmentGuides />

      {!isPresentationMode && <CanvasControls />}

      <ShapeLibrary />

      {isPresentationMode && stepNodes.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 glass-panel p-2 px-4 shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={prevStep}
            disabled={currentStep <= 0}
            className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Step</span>
            <span className="text-sm font-mono text-white font-medium">
              {currentStep + 1} <span className="text-white/30 mx-1">/</span> {stepNodes.length}
            </span>
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep >= stepNodes.length - 1}
            className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      <ExportModal />
      <ShareModal />
    </div>
  );
};
