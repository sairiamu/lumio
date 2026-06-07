import React, { useState, useEffect } from 'react';
import { Repeat, EyeOff, LogOut } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useCanvasStore } from '../../store/canvasStore';

interface SystemPodProps {
  onHideAll: () => void;
}

export const SystemPod: React.FC<SystemPodProps> = ({ onHideAll }) => {
  const { presentationLoop, togglePresentationLoop, togglePresentationMode, setIsPresentationPlaying, exitStepMode } = useCanvasStore();
  const [exitConfirm, setExitConfirm] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (exitConfirm) {
      timer = setTimeout(() => setExitConfirm(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [exitConfirm]);

  const handleExit = async () => {
    if (!exitConfirm) {
      setExitConfirm(true);
      return;
    }

    try {
      await getCurrentWindow().setFullscreen(false);
    } catch (err) {
      console.error(err);
    }
    setIsPresentationPlaying(false);
    exitStepMode();
    togglePresentationMode();
  };

  return (
    <div className="flex items-center gap-1 bg-panel backdrop-blur-xl border border-border rounded-[50px] p-2 px-3 shadow-2xl">
      <button
        onClick={togglePresentationLoop}
        className={`p-2 rounded-full transition-colors ${
          presentationLoop ? 'text-accent bg-accent/10' : 'text-text-muted hover:bg-white/5 hover:text-text'
        }`}
        title="Loop Presentation"
      >
        <Repeat size={18} />
      </button>

      <button
        onClick={onHideAll}
        className="p-2 text-text-muted hover:bg-white/5 hover:text-text rounded-full transition-colors"
        title="Hide Interface"
      >
        <EyeOff size={18} />
      </button>

      <button
        onClick={handleExit}
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all min-w-[40px] justify-center ${
          exitConfirm
            ? 'bg-danger text-white'
            : 'text-text-muted hover:text-danger hover:bg-danger/10'
        }`}
        title="Exit Presentation"
      >
        {exitConfirm ? (
          <span className="text-xs font-bold whitespace-nowrap px-1">Quit?</span>
        ) : (
          <LogOut size={18} />
        )}
      </button>
    </div>
  );
};
