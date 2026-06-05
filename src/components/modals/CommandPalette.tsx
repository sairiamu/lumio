import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useCommandList } from '../../data/commands';

export const CommandPalette = () => {
  const { isCommandPaletteOpen, toggleCommandPalette } = useCanvasStore();
  const commands = useCommandList();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q)
    );
  }, [query, commands]);

  const groupedResults = useMemo(() => {
    const categories = ['file', 'edit', 'canvas', 'shape', 'view'] as const;
    return categories.map(cat => ({
      category: cat,
      commands: filteredCommands.filter(c => c.category === cat)
    })).filter(g => g.commands.length > 0);
  }, [filteredCommands]);

  const flatResults = useMemo(() =>
    groupedResults.flatMap(g => g.commands),
    [groupedResults]
  );

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCommandPaletteOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          flatResults[selectedIndex].action();
          toggleCommandPalette();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, flatResults, selectedIndex, toggleCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm"
      onClick={() => toggleCommandPalette()}
    >
      <div
        className="w-[560px] max-h-[400px] bg-[#0F1117]/90 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 border-b border-white/10">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands (Ctrl+P)..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-100 placeholder:text-slate-500"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {groupedResults.length > 0 ? (
            groupedResults.map((group) => (
              <div key={group.category}>
                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/5">
                  {group.category}
                </div>
                {group.commands.map((cmd) => {
                  const flatIndex = flatResults.indexOf(cmd);
                  const isSelected = flatIndex === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      className={`flex items-center px-4 py-2.5 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[var(--accent-light)] border-l-2 border-[var(--accent)]' : 'hover:bg-white/5 border-l-2 border-transparent'
                      }`}
                      onClick={() => {
                        cmd.action();
                        toggleCommandPalette();
                      }}
                      onMouseEnter={() => setSelectedIndex(flatIndex)}
                    >
                      <cmd.icon className={`w-5 h-5 mr-3 ${isSelected ? 'text-[var(--accent)]' : 'text-slate-400'}`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-200">
                          {cmd.label}
                        </div>
                        {cmd.description && <div className="text-xs text-slate-500 line-clamp-1">{cmd.description}</div>}
                      </div>
                      {cmd.shortcut && (
                        <div className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 ml-4">
                          {cmd.shortcut}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-slate-500">
              No commands found for "{query}"
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300 mr-1">↑↓</kbd> Navigate</span>
            <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300 mr-1">Enter</kbd> Select</span>
          </div>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300 mr-1">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};
