import React from 'react';
import { Focus, LayoutGrid } from 'lucide-react';

interface FocusTogglePodProps {
  isFocusMode: boolean;
  onToggle: () => void;
}

export const FocusTogglePod: React.FC<FocusTogglePodProps> = ({ isFocusMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`glass-panel flex items-center gap-2 rounded-[50px] p-3 shadow-2xl transition-all duration-300 group pointer-events-auto ${
        isFocusMode
          ? 'bg-accent text-white'
          : 'text-text-muted hover:text-text'
      }`}
      title={isFocusMode ? "Show Controls" : "Focus on Timer"}
    >
      {isFocusMode ? (
        <>
          <LayoutGrid size={20} className="animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider pr-1">Exit Focus</span>
        </>
      ) : (
        <>
          <Focus size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-wider pr-1">Focus Mode</span>
        </>
      )}
    </button>
  );
};
