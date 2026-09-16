import React, { useMemo } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { EDGE_RELATIONSHIP_TYPES, EdgeRelationshipType, SemanticCategory } from '../../types/semantic';
import { catalogRegistry } from '../../data/catalogRegistry';
import { RelationshipConstraint } from '../../types/catalog';
import {
  Link,
  ArrowRight,
  ArrowLeftRight,
  GitCommit,
  Share2,
  Package,
  Sparkles
} from 'lucide-react';

const RELATIONSHIP_ICONS: Record<EdgeRelationshipType, React.ElementType> = {
  depends_on: GitCommit,
  calls: ArrowRight,
  reads_from: ArrowLeftRight,
  writes_to: ArrowRight,
  publishes_to: Share2,
  consumes_from: Link,
  connects_to: Link,
  contains: Package,
  generic: Link,
};

const RELATIONSHIP_DISPLAY_NAMES: Record<EdgeRelationshipType, string> = {
  depends_on: 'Depends On',
  calls: 'Calls',
  reads_from: 'Reads From',
  writes_to: 'Writes To',
  publishes_to: 'Publishes To',
  consumes_from: 'Consumes From',
  connects_to: 'Connects To',
  contains: 'Contains',
  generic: 'Generic',
};

export const RelationshipSelector: React.FC = () => {
  const { nodes, edges, selectedEdgeIds, updateEdgeData } = useCanvasStore();
  const selectedEdge = edges.find((e) => selectedEdgeIds.includes(e.id));

  const { sourceNode, targetNode } = useMemo(() => {
    if (!selectedEdge) return { sourceNode: null, targetNode: null };
    return {
      sourceNode: nodes.find(n => n.id === selectedEdge.source),
      targetNode: nodes.find(n => n.id === selectedEdge.target)
    };
  }, [selectedEdge, nodes]);

  const suggestions = useMemo(() => {
    if (!sourceNode || !targetNode) return new Set<EdgeRelationshipType>();

    const catalogId = sourceNode.data?.catalogId;
    if (!catalogId) return new Set<EdgeRelationshipType>();

    const item = catalogRegistry.getItem(catalogId);
    if (!item || !item.supportedRelationships) return new Set<EdgeRelationshipType>();

    const targetCategory = targetNode.data?.semantic?.category;
    const suggested = new Set<EdgeRelationshipType>();

    item.supportedRelationships.forEach(rel => {
      if (typeof rel === 'string') {
        suggested.add(rel);
      } else {
        const constraint = rel as RelationshipConstraint;
        if (!constraint.targetCategories || (targetCategory && constraint.targetCategories.includes(targetCategory))) {
          suggested.add(constraint.type);
        }
      }
    });

    return suggested;
  }, [sourceNode, targetNode]);

  if (!selectedEdge) return null;

  const currentRelationship = selectedEdge.data?.semantic?.relationship || 'generic';

  const handleRelationshipChange = (relationship: EdgeRelationshipType) => {
    updateEdgeData(selectedEdge.id, {
      semantic: {
        ...(selectedEdge.data?.semantic || {}),
        relationship,
      }
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateEdgeData(selectedEdge.id, {
      semantic: {
        ...(selectedEdge.data?.semantic || {}),
        metadata: {
          ...(selectedEdge.data?.semantic?.metadata || {}),
          description: e.target.value,
        }
      }
    });
  };

  const handleProtocolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateEdgeData(selectedEdge.id, {
      semantic: {
        ...(selectedEdge.data?.semantic || {}),
        metadata: {
          ...(selectedEdge.data?.semantic?.metadata || {}),
          protocol: e.target.value,
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="block text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted font-semibold">
            Relationship Type
          </label>
          {suggestions.size > 0 && (
            <div className="flex items-center gap-1 text-[9px] text-accent font-bold uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
              <Sparkles size={10} />
              Suggestions available
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {EDGE_RELATIONSHIP_TYPES.map((type) => {
            const Icon = RELATIONSHIP_ICONS[type] || Link;
            const isSelected = currentRelationship === type;
            const isSuggested = suggestions.has(type);

            return (
              <button
                key={type}
                type="button"
                onClick={() => handleRelationshipChange(type)}
                title={isSuggested ? `${RELATIONSHIP_DISPLAY_NAMES[type]} (Suggested)` : RELATIONSHIP_DISPLAY_NAMES[type]}
                className={`group relative flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-accent/20 border-accent text-accent shadow-sm'
                    : isSuggested
                    ? 'bg-accent/5 border-accent/30 text-text hover:bg-accent/10 hover:border-accent/50'
                    : 'bg-white/5 border-white/5 text-text-muted hover:bg-white/10 hover:border-white/20 hover:text-text'
                }`}
              >
                {isSuggested && !isSelected && (
                  <div className="absolute top-1 right-1">
                    <Sparkles size={8} className="text-accent" />
                  </div>
                )}
                <Icon size={14} className={isSelected ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                <span className="text-[8px] font-bold mt-1 uppercase tracking-tighter truncate w-full text-center">
                  {RELATIONSHIP_DISPLAY_NAMES[type]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="block text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted font-semibold">
            Protocol / Method
          </label>
          <input
            type="text"
            value={selectedEdge.data?.semantic?.metadata?.protocol || ''}
            onChange={handleProtocolChange}
            placeholder="e.g. gRPC, HTTPS, Kafka"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text placeholder:text-text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted font-semibold">
            Description
          </label>
          <textarea
            value={selectedEdge.data?.semantic?.metadata?.description || ''}
            onChange={handleDescriptionChange}
            placeholder="Describe the nature of this connection..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text placeholder:text-text-muted/40 focus:outline-none focus:border-accent/50 transition-colors resize-none h-20"
          />
        </div>
      </div>
    </div>
  );
};
