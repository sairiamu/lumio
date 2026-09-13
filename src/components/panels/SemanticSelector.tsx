import React from 'react';
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
  Zap
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
  cloud_resource: 'Cloud',
  device: 'Device',
  external_system: 'External',
  generic: 'Generic',
};

export const SemanticSelector: React.FC = () => {
  const { nodes, selectedNodeIds, updateNodeData } = useCanvasStore();
  const selectedNode = nodes.find((n) => selectedNodeIds.includes(n.id));

  if (!selectedNode) return null;

  const currentSemantic = selectedNode.data.semantic?.category || 'generic';

  const handleSemanticChange = (category: SemanticCategory) => {
    updateNodeData(selectedNode.id, {
      semantic: {
        category,
        metadata: selectedNode.data.semantic?.metadata || {}
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted">
        Semantic Role
      </label>
      <div className="grid grid-cols-4 gap-2">
        {SEMANTIC_CATEGORIES.map((category) => {
          const Icon = SEMANTIC_ICONS[category] || Box;
          const isSelected = currentSemantic === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleSemanticChange(category)}
              title={SEMANTIC_DISPLAY_NAMES[category]}
              className={`group flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-accent/20 border-accent text-accent shadow-sm'
                  : 'bg-white/5 border-white/5 text-text-muted hover:bg-white/10 hover:border-white/20 hover:text-text'
              }`}
            >
              <Icon size={14} className={isSelected ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              <span className="text-[7px] font-bold mt-1 uppercase tracking-tighter truncate w-full text-center">
                {SEMANTIC_DISPLAY_NAMES[category]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
