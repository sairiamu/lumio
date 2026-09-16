import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { COMMON_TECHNOLOGIES, CATEGORY_TECH_MAP, SemanticCategory } from '../../types/semantic';
import { Cpu, Search, Sparkles } from 'lucide-react';

export const TechnologySelector: React.FC = () => {
  const { nodes, selectedNodeIds, updateNodeData } = useCanvasStore();
  const selectedNode = nodes.find((n) => selectedNodeIds.includes(n.id));
  const containerRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedNode) return null;

  const currentSemantic = selectedNode.data.semantic;
  const currentCategory = currentSemantic?.category || 'generic';
  const currentTech = currentSemantic?.metadata?.technology || '';

  const handleTechChange = (tech: string) => {
    updateNodeData(selectedNode.id, {
      semantic: {
        category: currentCategory,
        metadata: {
          ...(currentSemantic?.metadata || {}),
          technology: tech
        }
      }
    });
  };

  const { recommended, other } = useMemo(() => {
    const categoryTechs = CATEGORY_TECH_MAP[currentCategory as SemanticCategory] || [];
    const searchFilter = filter.toLowerCase();

    const filteredRecommended = categoryTechs.filter(t =>
      t.toLowerCase().includes(searchFilter)
    );

    const filteredOther = COMMON_TECHNOLOGIES.filter(t =>
      !categoryTechs.includes(t) && t.toLowerCase().includes(searchFilter)
    );

    return { recommended: filteredRecommended, other: filteredOther };
  }, [currentCategory, filter]);

  return (
    <div className="flex flex-col gap-3" ref={containerRef}>
      <label className="block text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted">
        Technology / Stack
      </label>

      <div className={`relative rounded-2xl border transition-all duration-200 bg-white/5 px-3 py-2 ${
        isExpanded ? 'border-accent ring-4 ring-accent/5' : 'border-white/5 hover:border-white/20'
      }`}>
        <div className="flex items-center gap-2">
          <Cpu size={12} className={isExpanded ? 'text-accent' : 'text-accent/60'} />
          <input
            type="text"
            value={currentTech}
            onChange={(e) => {
              handleTechChange(e.target.value);
              setFilter(e.target.value);
            }}
            onFocus={() => setIsExpanded(true)}
            placeholder="e.g. PostgreSQL, Redis"
            className="w-full bg-transparent text-[12px] font-medium text-text outline-none placeholder:text-text-muted/50"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-2 p-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="relative mb-1">
            <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Filter technologies..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white/5 rounded-lg pl-6 pr-2 py-1.5 text-[10px] text-text outline-none border border-transparent focus:border-accent/30"
              autoFocus
            />
          </div>

          <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-3 p-1">
            {recommended.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1 px-1">
                  <Sparkles size={8} className="text-accent" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-accent">Recommended</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recommended.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => {
                        handleTechChange(tech);
                        setIsExpanded(false);
                        setFilter('');
                      }}
                      className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${
                        currentTech.toLowerCase() === tech.toLowerCase()
                          ? 'bg-accent text-white shadow-lg shadow-accent/20'
                          : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-text'
                      }`}
                    >
                      {tech.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {other.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black uppercase tracking-widest text-text-muted px-1">Common Stack</span>
                <div className="flex flex-wrap gap-1">
                  {other.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => {
                        handleTechChange(tech);
                        setIsExpanded(false);
                        setFilter('');
                      }}
                      className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${
                        currentTech.toLowerCase() === tech.toLowerCase()
                          ? 'bg-accent text-white shadow-lg shadow-accent/20'
                          : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-text'
                      }`}
                    >
                      {tech.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recommended.length === 0 && other.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-[10px] text-text-muted italic">No matching technologies</p>
                <p className="text-[8px] text-text-muted/50 mt-1">Press enter to keep "{filter}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
