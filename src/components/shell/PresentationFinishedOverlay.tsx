import React from 'react';
import { PartyPopper, RefreshCcw, X } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';

export const PresentationFinishedOverlay: React.FC = () => {
  const {
    isPresentationFinished,
    setIsPresentationFinished,
    startPresentation,
    togglePresentationMode
  } = useCanvasStore();

  if (!isPresentationFinished) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="glass-panel p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center gap-6 max-w-sm animate-in zoom-in-95 duration-500 delay-100">
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center text-success animate-bounce">
          <PartyPopper size={40} />
        </div>

        <div>
          <h2 className="text-2xl font-sora font-bold text-text mb-2">Presentation Complete!</h2>
          <p className="text-text-muted">You've reached the end of your slides.</p>
        </div>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => startPresentation(true)}
            className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
          >
            <RefreshCcw size={18} />
            Replay from Start
          </button>

          <button
            onClick={() => {
              setIsPresentationFinished(false);
              togglePresentationMode();
            }}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-text-muted font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5"
          >
            <X size={18} />
            Exit Presentation
          </button>
        </div>
      </div>
    </div>
  );
};
