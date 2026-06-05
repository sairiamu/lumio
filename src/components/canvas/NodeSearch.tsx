import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useReactFlow } from '@xyflow/react';

export const NodeSearch: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isPresentationMode,
    isSearchOpen,
    setIsSearchOpen
  } = useCanvasStore();
  const { fitView } = useReactFlow();
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isSearchOpen, setSearchQuery]);

  useEffect(() => {
    if (searchResults.length > 0) {
      setCurrentIndex(0);
    }
  }, [searchResults]);

  const handleNextMatch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      const nextIndex = (currentIndex + 1) % searchResults.length;
      setCurrentIndex(nextIndex);
      const nodeId = searchResults[nextIndex];
      fitView({ nodes: [{ id: nodeId }], duration: 400, padding: 2 });
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  if (!isSearchOpen || isPresentationMode) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] w-[320px] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="glass-panel flex items-center px-4 py-2 gap-3 rounded-xl shadow-2xl border-white/10">
        <Search className="w-4 h-4 text-accent" />
        <div className="flex-1 flex flex-col">
          <input
            ref={inputRef}
            type="text"
            className="bg-transparent border-none outline-none text-sm text-text placeholder:text-text-muted w-full py-1"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleNextMatch}
          />
          {searchQuery && (
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[10px] text-text-muted font-medium">
                {searchResults.length} {searchResults.length === 1 ? 'node' : 'nodes'} found
              </span>
              {searchResults.length > 0 && (
                <span className="text-[10px] text-accent/70 animate-pulse">
                  Enter to cycle • {currentIndex + 1}/{searchResults.length}
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
          }}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
        >
          <X className="w-4 h-4 text-text-muted group-hover:text-text" />
        </button>
      </div>
    </div>
  );
};
