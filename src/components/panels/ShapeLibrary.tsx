import React, { useState, useMemo, useRef } from 'react';
import * as Lucide from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { SHAPE_LIBRARY } from '../../data/shapeLibrary';
import { ShapeLibraryItem } from '../../types';

export const ShapeLibrary: React.FC = () => {
  const {
    isShapeLibraryOpen,
    setIsShapeLibraryOpen,
    setCurrentTool,
    setPendingNodeType,
    setPendingNodeTitle,
  } = useCanvasStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const totalShapes = useMemo(() => {
    return SHAPE_LIBRARY.reduce((acc, cat) => acc + cat.shapes.length, 0);
  }, []);

  const filteredCategories = useMemo(() => {
    let result = SHAPE_LIBRARY;

    if (selectedCategoryId) {
      result = result.filter(cat => cat.id === selectedCategoryId);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.map(cat => ({
        ...cat,
        shapes: cat.shapes.filter(shape =>
          shape.label.toLowerCase().includes(query) ||
          cat.label.toLowerCase().includes(query)
        )
      })).filter(cat => cat.shapes.length > 0);
    }

    return result;
  }, [searchQuery, selectedCategoryId]);

  const searchResultsCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.shapes.length, 0);
  }, [filteredCategories]);

  if (!isShapeLibraryOpen) return null;

  const handleShapeSelect = (shape: ShapeLibraryItem) => {
    setPendingNodeType(shape.lucideIcon);
    setPendingNodeTitle(shape.label);
    setCurrentTool('place');
    setIsShapeLibraryOpen(false);
  };

  const handleCategoryClick = (id: string) => {
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(id);
    }
  };

  return (
    <div
      className="fixed left-16 top-1/2 -translate-y-1/2 w-[300px] h-[500px] z-50 glass-panel flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-200"
      style={{
        backgroundColor: 'rgba(37, 40, 48, 0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}
    >
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-semibold text-[11px] tracking-wider">SHAPE LIBRARY</h2>
          <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">
            {totalShapes}
          </span>
        </div>
        <button
          onClick={() => setIsShapeLibraryOpen(false)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Lucide.X size={14} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-white/10 bg-white/5">
        <div className="relative">
          <Lucide.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
          <input
            type="text"
            placeholder="Search shapes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-md py-1.5 pl-8 pr-2 text-[11px] text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
        {searchQuery && (
          <div className="mt-1 px-1 text-[9px] text-slate-400 italic">
            {searchResultsCount} results for '{searchQuery}'
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Category Sidebar */}
        <div className="w-[44px] hover:w-[140px] transition-all duration-300 border-r border-white/10 bg-black/10 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1 z-20 group/sidebar">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
              !selectedCategoryId ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Lucide.LayoutGrid size={16} className="shrink-0" />
            <span className="text-[10px] font-medium truncate opacity-0 group-hover/sidebar:opacity-100 transition-opacity">All</span>
          </button>

          <div className="my-1 border-t border-white/5" />

          {SHAPE_LIBRARY.map((category) => {
            const Icon = (Lucide as any)[category.icon] || Lucide.Box;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                title={category.label}
                className={`flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                  selectedCategoryId === category.id ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="text-[10px] font-medium truncate opacity-0 group-hover/sidebar:opacity-100 transition-opacity">{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Shapes Grid */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-black/5"
        >
          <div className="flex flex-col gap-4">
            {filteredCategories.map((category) => (
              <div key={category.id} className="flex flex-col gap-2">
                <div className="sticky top-0 z-10 flex items-center justify-between bg-slate-900/95 backdrop-blur-md py-1 px-2 -mx-2 border-y border-white/5">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                    {category.label}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold bg-white/5 px-1.5 rounded">
                    {category.shapes.length}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 justify-items-center">
                  {category.shapes.map((shape) => {
                    const Icon = (Lucide as any)[shape.lucideIcon] || Lucide.Box;
                    return (
                      <button
                        key={shape.id}
                        onClick={() => handleShapeSelect(shape)}
                        title={shape.label}
                        className="group flex flex-col items-center justify-center gap-1 w-[52px] h-[52px] rounded-lg transition-all hover:bg-white/10 active:scale-90 border border-white/5 hover:border-indigo-500/40"
                      >
                        <div className="text-slate-400 group-hover:text-indigo-400 transition-colors">
                          <Icon size={24} />
                        </div>
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-200 transition-colors truncate w-full text-center px-0.5">
                          {shape.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
                <Lucide.SearchX size={24} className="mb-2 opacity-20" />
                <p className="text-[10px]">No shapes found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
