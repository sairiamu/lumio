import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { EDGE_RELATIONSHIP_TYPES, EdgeRelationshipType } from '../../types/semantic';
import {
  Link,
  ArrowRight,
  ArrowLeftRight,
  GitCommit,
  Share2,
  Package
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
  const { edges, selectedEdgeIds, updateEdgeData } = useCanvasStore();
  const selectedEdge = edges.find((e) => selectedEdgeIds.includes(e.id));

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

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted font-semibold">
        Relationship Type
      </label>
      <div className="grid grid-cols-3 gap-2">
        {EDGE_RELATIONSHIP_TYPES.map((type) => {
          const Icon = RELATIONSHIP_ICONS[type] || Link;
          const isSelected = currentRelationship === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => handleRelationshipChange(type)}
              title={RELATIONSHIP_DISPLAY_NAMES[type]}
              className={`group flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-accent/20 border-accent text-accent shadow-sm'
                  : 'bg-white/5 border-white/5 text-text-muted hover:bg-white/10 hover:border-white/20 hover:text-text'
              }`}
            >
              <Icon size={14} className={isSelected ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              <span className="text-[8px] font-bold mt-1 uppercase tracking-tighter truncate w-full text-center">
                {RELATIONSHIP_DISPLAY_NAMES[type]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
