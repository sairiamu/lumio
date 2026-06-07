import React from 'react';
import { SkipBack, ChevronLeft, Play, Pause, ChevronRight, SkipForward } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';

export const NavPod: React.FC = () => {
  const {
    currentStep,
    stepNodes,
    setStep,
    nextStep,
    prevStep,
    isPresentationPlaying,
    setIsPresentationPlaying,
    presentationLoop
  } = useCanvasStore();

  const totalSteps = stepNodes.length;

  return (
    <div className="glass-panel flex items-center gap-1 rounded-[50px] p-2 px-4 shadow-2xl pointer-events-auto">
      <button
        onClick={() => setStep(0)}
        className="w-9 h-9 flex items-center justify-center rounded-full transition-all text-text-muted hover:bg-white/10 hover:text-text active:scale-92"
        title="First Slide"
      >
        <SkipBack size={18} />
      </button>
      <button
        onClick={prevStep}
        disabled={currentStep <= 0}
        className="w-9 h-9 flex items-center justify-center rounded-full transition-all text-text-muted hover:bg-white/10 hover:text-text active:scale-92 disabled:opacity-30 disabled:pointer-events-none"
        title="Previous"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={() => setIsPresentationPlaying(!isPresentationPlaying)}
        className="relative w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-95 group mx-1"
      >
        <div className="absolute inset-0 bg-accent rounded-full shadow-lg shadow-accent/40 group-hover:brightness-110 transition-all" />
        {isPresentationPlaying ? (
          <Pause size={20} className="relative fill-current text-white" />
        ) : (
          <Play size={20} className="relative fill-current ml-0.5 text-white" />
        )}
      </button>

      <button
        onClick={nextStep}
        disabled={currentStep >= totalSteps - 1 && !presentationLoop}
        className="w-9 h-9 flex items-center justify-center rounded-full transition-all text-text-muted hover:bg-white/10 hover:text-text active:scale-92 disabled:opacity-30 disabled:pointer-events-none"
        title="Next"
      >
        <ChevronRight size={20} />
      </button>
      <button
        onClick={() => setStep(totalSteps - 1)}
        className="w-9 h-9 flex items-center justify-center rounded-full transition-all text-text-muted hover:bg-white/10 hover:text-text active:scale-92"
        title="Last Slide"
      >
        <SkipForward size={18} />
      </button>
    </div>
  );
};
