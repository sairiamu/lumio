import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';

export const SpeedPod: React.FC = () => {
  const { presentationTimer, setPresentationTimer } = useCanvasStore();
  const [isCustom, setIsCustom] = useState(false);
  const presets = [3, 5, 10, 30];

  const handleCustomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCustom(false);
  };

  return (
    <div className="flex items-center gap-1 bg-panel backdrop-blur-xl border border-border rounded-[50px] p-2 transition-all duration-300 shadow-2xl">
      {presets.map((s) => (
        <button
          key={s}
          onClick={() => {
            setPresentationTimer(s);
            setIsCustom(false);
          }}
          className={`w-10 h-8 flex items-center justify-center rounded-full text-[11px] font-bold transition-all ${
            presentationTimer === s && !isCustom
              ? 'bg-accent text-white shadow-lg shadow-accent/40'
              : 'text-text-muted hover:bg-white/5 hover:text-text'
          }`}
        >
          {s}s
        </button>
      ))}

      <div className={`flex items-center overflow-hidden transition-all duration-300 ${isCustom ? 'w-24 ml-1' : 'w-16'}`}>
        {!isCustom ? (
          <button
            onClick={() => setIsCustom(true)}
            className={`w-full h-8 flex items-center justify-center rounded-full text-[11px] font-bold transition-all ${
              !presets.includes(presentationTimer)
                ? 'bg-accent text-white shadow-lg shadow-accent/40'
                : 'text-text-muted hover:bg-white/5 hover:text-text'
            }`}
          >
            Custom
          </button>
        ) : (
          <form onSubmit={handleCustomSubmit} className="flex items-center bg-black/40 rounded-full px-2 border border-accent/50">
            <input
              type="number"
              min="1"
              max="300"
              value={presentationTimer}
              onChange={(e) => setPresentationTimer(Math.max(1, Math.min(300, parseInt(e.target.value) || 1)))}
              className="w-10 bg-transparent border-none outline-none text-[11px] font-bold text-text text-center"
              autoFocus
              onBlur={() => { if(presets.includes(presentationTimer)) setIsCustom(false) }}
            />
            <span className="text-[10px] text-text-muted mr-1">s</span>
            <button type="submit" className="text-accent hover:brightness-110">
              <Check size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
