import React from 'react';
import { X, Zap, Box } from 'lucide-react';

interface ProjectTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'elemental-sketch' | 'electrical') => void;
}

export const ProjectTypeModal: React.FC<ProjectTypeModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-2xl flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-border">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <Box className="w-5 h-5 text-accent" />
            <h2 className="font-sora font-semibold text-lg text-text">Choose Project Type</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Elemental Sketch */}
          <button
            onClick={() => onSelect('elemental-sketch')}
            className="group glass-panel bg-white/5 border-border hover:border-accent/50 transition-all duration-300 rounded-xl p-6 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
              <Box size={32} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Elemental Sketch</h3>
            <p className="text-sm text-text-muted">
              Visual communication, diagramming, and freehand drawing.
            </p>
          </button>

          {/* Electrical */}
          <button
            onClick={() => onSelect('electrical')}
            className="group glass-panel bg-white/5 border-border hover:border-accent/50 transition-all duration-300 rounded-xl p-6 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4 group-hover:scale-110 transition-transform">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Electrical</h3>
            <p className="text-sm text-text-muted">
              Arduino design and offline simulation.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
