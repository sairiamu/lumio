import React, { useState, useRef, useEffect } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { SEMANTIC_CATEGORIES, SemanticCategory } from '../../types/semantic';
import {
  Database,
  User,
  Monitor,
  Cloud,
  Globe,
  Box,
  Layers,
  Cpu,
  Server,
  HardDrive,
  Share2,
  Zap,
  ChevronDown
} from 'lucide-react';

const SEMANTIC_ICONS: Record<SemanticCategory, React.ElementType> = {
  user: User,
  client: Monitor,
  service: Layers,
  api: Globe,
  database: Database,
  cache: Zap,
  queue: Share2,
  storage: HardDrive,
  cloud_resource: Cloud,
  device: Cpu,
  external_system: Server,
  generic: Box,
};

const SEMANTIC_DISPLAY_NAMES: Record<SemanticCategory, string> = {
  user: 'User',
  client: 'Client',
  service: 'Service',
  api: 'API',
  database: 'Database',
  cache: 'Cache',
  queue: 'Queue',
  storage: 'Storage',
  cloud_resource: 'Cloud Resource',
  device: 'Device',
  external_system: 'External System',
  generic: 'Generic',
};

export const SemanticSelector: React.FC = () => {
  const { nodes, selectedNodeIds, updateNodeData } = useCanvasStore();
  const selectedNode = nodes.find((n) => selectedNodeIds.includes(n.id));
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedNode) return null;

  const currentCategory = selectedNode.data.semantic?.category || 'generic';
  const Icon = SEMANTIC_ICONS[currentCategory] || Box;

  const handleSemanticChange = (category: SemanticCategory) => {
    updateNodeData(selectedNode.id, {
      semantic: {
        category,
        metadata: selectedNode.data.semantic?.metadata || {}
      }
    });
  };

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label className="block text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted">
        Semantic Role
      </label>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl border transition-all duration-200 ${
            isOpen
              ? 'bg-accent/10 border-accent text-accent shadow-lg shadow-accent/5'
              : 'bg-white/5 border-white/5 text-text hover:bg-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-accent text-white' : 'bg-accent/20 text-accent'}`}>
              <Icon size={14} />
            </div>
            <span className="text-[12px] font-bold uppercase tracking-wider">
              {SEMANTIC_DISPLAY_NAMES[currentCategory]}
            </span>
          </div>
          <ChevronDown
            size={14}
            className={`text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-2xl glass-panel border border-white/10 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200 max-h-64 overflow-y-auto custom-scrollbar">
            {SEMANTIC_CATEGORIES.map((category) => {
              const CatIcon = SEMANTIC_ICONS[category] || Box;
              const isSelected = currentCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    handleSemanticChange(category);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                    isSelected
                      ? 'bg-accent text-white shadow-md'
                      : 'hover:bg-white/10 text-text-muted hover:text-text'
                  }`}
                >
                  <div className={`transition-transform duration-200 ${isSelected ? '' : 'group-hover:scale-110'}`}>
                    <CatIcon size={14} className={isSelected ? 'text-white' : 'text-accent'} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide">
                    {SEMANTIC_DISPLAY_NAMES[category]}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
