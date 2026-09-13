import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { COMMON_TECHNOLOGIES } from '../../types/semantic';
import { Cpu, Search } from 'lucide-react';

export const TechnologySelector: React.FC = () => {
  const { nodes, selectedNodeIds, updateNodeData } = useCanvasStore();
  const selectedNode = nodes.find((n) => selectedNodeIds.includes(n.id));

  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState('');

  if (!selectedNode) return null;

  const currentSemantic = selectedNode.data.semantic;
  const currentTech = currentSemantic?.metadata?.technology || '';

  const handleTechChange = (tech: string) => {
    updateNodeData(selectedNode.id, {
      semantic: {
        category: currentSemantic?.category || 'generic',
        metadata: {
          ...(currentSemantic?.metadata || {}),
          technology: tech
        }
      }
    });
  };

  const filteredTechs = COMMON_TECHNOLOGIES.filter(t =>
    t.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted">
        Technology / Stack
      </label>

      <div className="relative rounded-2xl border border-border bg-white/5 px-3 py-2 transition-all hover:border-white/20 focus-within:border-accent/50">
        <div className="flex items-center gap-2">
          <Cpu size={12} className="text-accent/60" />
          <input
            type="text"
            value={currentTech}
            onChange={(e) => handleTechChange(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="e.g. PostgreSQL, Redis"
            className="w-full bg-transparent text-[12px] font-medium text-text outline-none placeholder:text-text-muted/50"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-2 p-2 rounded-2xl bg-black/20 border border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative mb-1">
            <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Filter technologies..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white/5 rounded-lg pl-6 pr-2 py-1 text-[10px] text-text outline-none border border-transparent focus:border-accent/30"
            />
          </div>

          <div className="max-h-32 overflow-y-auto custom-scrollbar flex flex-wrap gap-1">
            {filteredTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => {
                  handleTechChange(tech);
                  setFilter('');
                }}
                className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors ${
                  currentTech === tech
                    ? 'bg-accent text-white'
                    : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-text'
                }`}
              >
                {tech.replace('_', ' ')}
              </button>
            ))}
            {filteredTechs.length === 0 && (
              <span className="text-[9px] text-text-muted italic p-2">No matching common techs</span>
            )}
          </div>

          <button
            onClick={() => setIsExpanded(false)}
            className="mt-1 text-[9px] text-accent/70 hover:text-accent font-bold uppercase tracking-widest self-center py-1"
          >
            Close suggestions
          </button>
        </div>
      )}
    </div>
  );
};
