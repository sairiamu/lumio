import React from 'react';
import { Play, MousePointer2, Clock, X, Info } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';

export const PresentationSetupModal: React.FC = () => {
  const {
    isPresentationSetupOpen,
    setPresentationSetupOpen,
    stepNodes,
    presentationTimer,
    setIsPresentationPlaying,
    setStep,
    togglePresentationMode
  } = useCanvasStore();

  if (!isPresentationSetupOpen) return null;

  const isEmpty = stepNodes.length === 0;

  const handleStartAuto = () => {
    setStep(0);
    setIsPresentationPlaying(true);
    setPresentationSetupOpen(false);
  };

  const handleManualOnly = () => {
    setStep(0);
    setIsPresentationPlaying(false);
    setPresentationSetupOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setPresentationSetupOpen(false)}
      />

      <div className="relative w-full max-w-md bg-panel border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-sora font-bold text-text">Presentation Ready</h2>
            <button
              onClick={() => setPresentationSetupOpen(false)}
              className="p-1 hover:bg-white/5 rounded-full transition-colors text-text-muted"
            >
              <X size={20} />
            </button>
          </div>

          {isEmpty ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-accent/10 border border-accent/20 rounded-xl">
                <div className="p-2 bg-accent/20 rounded-lg text-accent">
                  <Info size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-text mb-1">No slides added yet</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Right-click any node and select <span className="text-text font-medium">'Add to Presentation'</span> to begin building your story.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPresentationSetupOpen(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-text font-bold rounded-xl transition-all"
              >
                Got it
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold block mb-1">Total Slides</span>
                  <span className="text-2xl font-sora font-bold text-text">{stepNodes.length}</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold block mb-1">Auto-Advance</span>
                  <span className="text-2xl font-sora font-bold text-text">{presentationTimer}s</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold block">Estimated Duration</span>
                  <span className="text-sm font-medium text-text">{(stepNodes.length * presentationTimer)} seconds</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleStartAuto}
                  className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                >
                  <Play size={18} fill="currentColor" />
                  Start Auto
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleManualOnly}
                    className="py-3 bg-white/5 hover:bg-white/10 text-text font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <MousePointer2 size={18} />
                    Manual Only
                  </button>
                  <button
                    onClick={() => setPresentationSetupOpen(false)}
                    className="py-3 bg-white/5 hover:bg-white/10 text-text-muted font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
