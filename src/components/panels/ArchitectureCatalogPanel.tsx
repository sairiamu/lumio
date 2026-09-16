import React, { useState, useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { getCatalogItemVisuals, catalogRegistry } from '../../data/architectureCatalog';
import { CatalogItem } from '../../types/catalog';

export const ArchitectureCatalogPanel: React.FC = () => {
  const {
    isArchitectureCatalogOpen,
    setIsArchitectureCatalogOpen,
    setCurrentTool,
    setPendingCatalogItemId,
  } = useCanvasStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(catalogRegistry.getAllItems().map(item => item.category));
    return Array.from(cats);
  }, []);

  const filteredItems = useMemo(() => {
    return catalogRegistry.getAllItems().filter(item => {
      const matchesSearch = item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (!isArchitectureCatalogOpen) return null;

  const handleItemSelect = (item: CatalogItem) => {
    setPendingCatalogItemId(item.id);
    setCurrentTool('place');
    setIsArchitectureCatalogOpen(false);
  };

  return (
    <div className="fixed left-16 top-1/2 -translate-y-1/2 w-[320px] h-[600px] z-50 glass-panel flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-200 shadow-2xl border border-white/10 rounded-2xl bg-graphite/90 backdrop-blur-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
            <Lucide.Cpu size={16} />
          </div>
          <h2 className="text-white font-black text-[11px] tracking-[0.2em] uppercase">Architecture Catalog</h2>
        </div>
        <button
          onClick={() => setIsArchitectureCatalogOpen(false)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Lucide.X size={16} />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="p-4 flex flex-col gap-3 bg-white/5 border-b border-white/10">
        <div className="relative">
          <Lucide.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[12px] text-white placeholder:text-slate-600 focus:outline-none focus:border-accent/50 transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              !selectedCategory ? 'bg-accent text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat ? 'bg-accent text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-black/5">
        <div className="grid grid-cols-1 gap-3">
          {filteredItems.map((item) => {
            const Icon = (Lucide as any)[item.icon] || Lucide.Box;
            const visuals = getCatalogItemVisuals(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className="group flex items-start gap-4 p-3 rounded-xl transition-all hover:bg-white/10 border border-white/5 hover:border-accent/30 text-left active:scale-[0.98]"
              >
                <div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${visuals.clayColor}20`, color: visuals.clayColor }}
                >
                  <Icon size={20} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-bold text-white group-hover:text-accent transition-colors">
                    {item.displayName}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </span>
                  <div className="flex gap-1 mt-1.5">
                    {item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20 opacity-40">
            <Lucide.SearchX size={32} className="mb-3" />
            <p className="text-[11px] font-bold uppercase tracking-widest">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
};
