import React from 'react';
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
  Info,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { SemanticCategory, SemanticMetadata } from '../../types/semantic';

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

const ENV_COLORS: Record<string, string> = {
  development: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  staging: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  production: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  infrastructure: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

export const SemanticIdentity: React.FC = () => {
  const { nodes, selectedNodeIds, updateNodeData } = useCanvasStore();
  const selectedNode = nodes.find((n) => selectedNodeIds.includes(n.id));

  if (!selectedNode) return null;

  const semantic = selectedNode.data.semantic;
  const category = semantic?.category || 'generic';
  const tech = semantic?.metadata?.technology;
  const env = semantic?.metadata?.environment as string | undefined;
  const description = selectedNode.data.description;

  const Icon = SEMANTIC_ICONS[category] || Box;

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

  return (
    <div className="flex flex-col gap-4 p-3 rounded-2xl bg-accent/5 border border-accent/10 shadow-inner">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-accent/20 text-accent">
            <Icon size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent/60 leading-none mb-1">
              {category.replace('_', ' ')}
            </span>
            <span className="text-[13px] font-bold text-text truncate max-w-[140px]">
              {tech || 'Unspecified Tech'}
            </span>
          </div>
        </div>

        {env && (
          <div className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-tighter ${ENV_COLORS[env] || 'text-text-muted bg-white/5 border-white/10'}`}>
            {env}
          </div>
        )}
      </div>

      {(description || env) && (
        <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
          {description && (
            <div className="flex gap-2">
              <Info size={10} className="text-text-muted shrink-0 mt-0.5" />
              <p className="text-[10px] text-text-muted/80 leading-relaxed line-clamp-2 italic">
                {description}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-1">
            <Activity size={10} className="text-text-muted shrink-0" />
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {(['development', 'staging', 'production', 'infrastructure'] as const).map((e) => (
                <button
                  key={e}
                  onClick={() => handleEnvChange(env === e ? undefined : e)}
                  className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase transition-all ${
                    env === e
                      ? 'bg-accent text-white'
                      : 'bg-white/5 text-text-muted hover:bg-white/10'
                  }`}
                >
                  {e.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!env && !description && (
        <div className="text-[9px] text-text-muted/40 italic flex items-center gap-1.5">
          <ShieldCheck size={10} />
          Semantic identity partially defined
        </div>
      )}
    </div>
  );
};
