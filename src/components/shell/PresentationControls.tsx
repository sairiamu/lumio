import React, { useState } from 'react';
import {
  SkipBack,
  ChevronLeft,
  Play,
  Pause,
  ChevronRight,
  SkipForward,
  Repeat,
  Clock,
  X
} from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { usePresentationTimer } from '../../hooks/usePresentationTimer';

export const PresentationControls: React.FC = () => {
  const {
    isPresentationMode,
    stepNodes,
    currentStep,
    setStep,
    nextStep,
    prevStep,
    isPresentationPlaying,
    setIsPresentationPlaying,
    presentationTimer,
    setPresentationTimer,
    presentationLoop,
    togglePresentationLoop,
    exitStepMode,
    togglePresentationMode,
    isPresentationFinished
  } = useCanvasStore();

  const { progress } = usePresentationTimer();
  const [isCustomTimer, setIsCustomTimer] = useState(false);

  if (!isPresentationMode || stepNodes.length === 0 || isPresentationFinished) return null;

  const presets = [3, 5, 10, 30];

  const handleExit = () => {
    setIsPresentationPlaying(false);
    exitStepMode();
    togglePresentationMode();
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3">
      {/* Control Pill */}
      <div className="bg-panel/80 backdrop-blur-xl border border-border rounded-full px-6 py-3 shadow-2xl flex items-center gap-6">
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStep(0)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-text"
            title="First Slide"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={prevStep}
            disabled={currentStep <= 0}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-text disabled:opacity-30"
            title="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => setIsPresentationPlaying(!isPresentationPlaying)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-lg ${
              isPresentationPlaying
                ? 'bg-accent text-white scale-110'
                : 'bg-white/10 text-text hover:bg-white/20'
            }`}
          >
            {isPresentationPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
          </button>

          <button
            onClick={nextStep}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-text"
            title="Next"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => setStep(stepNodes.length - 1)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-text"
            title="Last Slide"
          >
            <SkipForward size={18} />
          </button>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Info & Timer */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start min-w-[80px]">
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Slide</span>
            <span className="text-sm font-medium font-sans">
              {currentStep + 1} <span className="text-text-muted">/ {stepNodes.length}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {presets.map(s => (
              <button
                key={s}
                onClick={() => {
                  setPresentationTimer(s);
                  setIsCustomTimer(false);
                }}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                  presentationTimer === s && !isCustomTimer
                    ? 'bg-accent text-white shadow-sm'
                    : 'hover:bg-white/5 text-text-muted'
                }`}
              >
                {s}s
              </button>
            ))}
            <div className="relative flex items-center">
               <button
                onClick={() => setIsCustomTimer(true)}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                  isCustomTimer
                    ? 'bg-accent text-white shadow-sm'
                    : 'hover:bg-white/5 text-text-muted'
                }`}
              >
                <Clock size={10} />
                {isCustomTimer ? '' : 'Custom'}
              </button>
              {isCustomTimer && (
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={presentationTimer}
                  onChange={(e) => setPresentationTimer(Math.max(1, Math.min(300, parseInt(e.target.value) || 1)))}
                  className="w-12 bg-transparent border-none outline-none text-[11px] font-bold text-white text-center"
                  autoFocus
                />
              )}
            </div>
          </div>

          <button
            onClick={togglePresentationLoop}
            className={`p-2 rounded-lg transition-colors ${
              presentationLoop ? 'text-accent bg-accent/10' : 'text-text-muted hover:bg-white/5'
            }`}
            title="Loop Presentation"
          >
            <Repeat size={18} />
          </button>
        </div>

        <div className="h-6 w-px bg-border" />

        <button
          onClick={handleExit}
          className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors text-text-muted"
          title="Exit Presentation"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-md px-4">
        <div className="h-[3px] w-full bg-steel rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-success transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
