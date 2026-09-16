import React from 'react';
import { NodeProps, NodeResizer, Node } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';
import * as LucideIcons from 'lucide-react';
import { getCatalogItem, getCatalogItemVisuals } from '../../data/architectureCatalog';

export const UniversalNode: React.FC<NodeProps<Node<NodeData>>> = (props) => {
  const data = props.data as NodeData;
  const catalogItem = data.catalogId ? getCatalogItem(data.catalogId) : null;
  const visuals = data.catalogId ? getCatalogItemVisuals(data.catalogId) : null;

  const shapeType = catalogItem?.icon || (data.shapeType as string) || 'Database';
  const displayName = data.title || catalogItem?.displayName || shapeType;

  // Technology and Version Label logic - driven by catalog metadata or instance overrides
  const technology = (data.semantic?.metadata?.technology || catalogItem?.defaultSemantic?.metadata?.technology || '') as string;
  const version = (data.semantic?.metadata?.version || data.parameters?.find(p => p.key === 'version' || p.key === 'runtime')?.value || '') as string;
  const techLabel = technology ? (version ? `${technology} ${version}` : technology) : '';

  // Fallback to Box if icon not found
  const IconComponent = (LucideIcons as any)[shapeType] || LucideIcons.Box;

  return (
    <BaseNode
      {...props}
      clayColor={data.clayColor || visuals?.clayColor || 'var(--accent-light)'}
      className="rounded-[20px] flex items-center justify-center min-w-[80px] min-h-[80px] group"
      contentClassName="!p-0"
      hideHeader={true}
      style={{
        borderColor: data.strokeColor || visuals?.accentColor || 'var(--border-subtle)',
        borderWidth: data.strokeWidth || 1.5,
      }}
    >
      <div className="w-full h-full flex flex-col py-2 px-1" style={{ color: 'var(--text)' }}>
        {/* Technology Icon */}
        <div className="flex-none flex items-center justify-center pt-1 pb-0.5">
          <IconComponent
            size={Math.max(18, Math.min(28, ((props.width as number) ?? 80) * 0.25))}
            className="opacity-90"
            strokeWidth={1.5}
            color={visuals?.accentColor || 'currentColor'}
          />
        </div>

        {/* Display Name & Tech/Version Info */}
        <div className="flex-1 flex flex-col items-center justify-center gap-0.5 overflow-hidden">
          <p
            className="m-0 text-center w-full px-2"
            style={{
              fontSize: 'clamp(9px, 3.5%, 12px)',
              fontWeight: 700,
              fontFamily: "'Sora', sans-serif",
              lineHeight: 1.1,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {displayName}
          </p>

          {techLabel && (
            <p
              className="m-0 text-center w-full opacity-60 px-2 italic"
              style={{
                fontSize: '8.5px',
                fontWeight: 500,
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textTransform: 'lowercase'
              }}
            >
              {techLabel}
            </p>
          )}
        </div>
      </div>

      {/* Tooltip on hover */}
      <div className="absolute invisible group-hover:visible bg-graphite/90 backdrop-blur-md border border-white/10 p-2 rounded-lg shadow-xl -bottom-14 left-1/2 -translate-x-1/2 z-[100] min-w-[140px] pointer-events-none transition-all duration-200">
        <p className="text-[11px] font-bold text-white m-0">{displayName}</p>
        {techLabel && (
          <p className="text-[9px] text-accent-light font-mono m-0 mt-0.5 uppercase tracking-wider">{techLabel}</p>
        )}
        {data.description && (
          <p className="text-[9px] text-fog m-0 mt-1 line-clamp-2 leading-relaxed">{data.description}</p>
        )}
      </div>

      <NodeResizer
        isVisible={!!props.selected}
        minWidth={60}
        minHeight={60}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--accent)', borderRadius: '50%', boxShadow: 'none' }}
        lineStyle={{ borderColor: 'var(--accent)', borderWidth: 1, boxShadow: 'none' }}
      />
    </BaseNode>
  );
};
