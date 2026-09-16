import React, { useState, useRef, useEffect } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
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
import { SemanticCategory, SemanticMetadata, SEMANTIC_CATEGORIES } from '../../types/semantic';

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
  cloud_resource: 'Cloud',
  device: 'Device',
  external_system: 'System',
  generic: 'Generic',
};

export const SemanticIdentity: React.FC = () => {
  const { nodes, selectedNodeIds, updateNodeData } = useCanvasStore();
  const selectedNode = nodes.find((n) => selectedNodeIds.includes(n.id));
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedNode) return null;

  const semantic = selectedNode.data.semantic;
  const category = semantic?.category || 'generic';
  const tech = semantic?.metadata?.technology;
  const env = semantic?.metadata?.environment as string | undefined;
  const description = selectedNode.data.description;

  const Icon = SEMANTIC_ICONS[category] || Box;

  const handleCategoryChange = (cat: SemanticCategory) => {
    updateNodeData(selectedNode.id, {
      semantic: {
        category: cat,
        metadata: semantic?.metadata || {}
      }
    });
    setIsSelectorOpen(false);
  };

  const handleEnvChange = (newEnv: SemanticMetadata['environment']) => {
    updateNodeData(selectedNode.id, {
      semantic: {
        category,
        metadata: {
          ...(semantic?.metadata || {}),
          environment: newEnv
        }
      }
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(selectedNode.id, {
      description: e.target.value
    });
  };

  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(selectedNode.id, {
      semantic: {
        category,
        metadata: {
          ...(semantic?.metadata || {}),
          technology: e.target.value
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
          <Icon size={14} />
        </div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text">
          Semantic Identity
        </h3>
      </div>

      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 shadow-inner backdrop-blur-sm">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-[80px_1fr] gap-y-3 items-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/50">Type</span>
          <div className="relative" ref={selectorRef}>
            <button
              onClick={() => setIsSelectorOpen(!isSelectorOpen)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-accent uppercase tracking-wider hover:opacity-80 transition-opacity"
            >
              {SEMANTIC_DISPLAY_NAMES[category]}
              <ChevronDown size={10} className={`transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSelectorOpen && (
              <div className="absolute top-full left-0 mt-2 p-1.5 rounded-xl glass-panel border border-white/10 shadow-2xl z-[100] w-40 max-h-48 overflow-y-auto custom-scrollbar">
                {SEMANTIC_CATEGORIES.map((cat) => {
                  const CatIcon = SEMANTIC_ICONS[cat] || Box;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-colors ${
                        category === cat ? 'bg-accent text-white' : 'hover:bg-white/10 text-text-muted'
                      }`}
                    >
                      <CatIcon size={12} />
                      {SEMANTIC_DISPLAY_NAMES[cat]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/50">Stack</span>
          <input
            type="text"
            value={tech || ''}
            onChange={handleTechChange}
            placeholder="e.g. React, Node.js"
            className="bg-transparent border-none p-0 text-[11px] font-bold text-text outline-none placeholder:text-text-muted/30"
          />

          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/50">Env</span>
          <div className="flex gap-1">
            {(['development', 'staging', 'production', 'infrastructure'] as const).map((e) => (
              <button
                key={e}
                onClick={() => handleEnvChange(env === e ? undefined : e)}
                title={e}
                className={`w-6 h-5 rounded-md text-[7px] font-black uppercase transition-all border flex items-center justify-center ${
                  env === e
                    ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20'
                    : 'bg-white/5 border-transparent text-text-muted hover:bg-white/10'
                }`}
              >
                {e.slice(0, 1)}
              </button>
            ))}
            {!env && <span className="text-[8px] text-text-muted/40 italic ml-1 self-center">None</span>}
          </div>
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
          <label className="text-[9px] font-black uppercase tracking-widest text-text-muted/50">
            Description
          </label>
          <textarea
            value={description || ''}
            onChange={handleDescriptionChange}
            placeholder="What does this component do?"
            className="w-full bg-void/30 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-text-muted leading-relaxed placeholder:text-text-muted/30 focus:outline-none focus:border-accent/30 transition-colors resize-none h-16 custom-scrollbar"
          />
        </div>
      </div>
    </div>
  );
};
