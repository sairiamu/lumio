import React from 'react';
import { NodeProps, NodeResizer, Node } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';
import * as LucideIcons from 'lucide-react';

export const UniversalNode: React.FC<NodeProps<Node<NodeData>>> = (props) => {
  const data = props.data as NodeData;
  const shapeType = (data.shapeType as string) || 'Database';
  // Fallback to Box if icon not found
  const IconComponent = (LucideIcons as any)[shapeType] || LucideIcons.Box;

  return (
    <BaseNode
      {...props}
      clayColor={data.clayColor || 'var(--accent-light)'}
      className="rounded-[20px] flex items-center justify-center min-w-[80px] min-h-[80px] group"
      contentClassName="!p-0"
      hideHeader={true}
    >
      <div className="w-full h-full flex flex-col" style={{ color: 'var(--text)' }}>
        <div className="h-[45%] flex items-center justify-center pt-2">
          <IconComponent
            size={Math.max(20, Math.min(32, ((props.width as number) ?? 80) * 0.3))}
            color="currentColor"
          />
        </div>
        <div className="h-[55%] overflow-hidden px-2 flex items-start justify-center">
          <p
            className="m-0 text-center w-full"
            style={{
              fontSize: 'clamp(9px, 3%, 13px)',
              fontWeight: 700,
              fontFamily: "'Sora', sans-serif",
              lineHeight: 1.2,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {data.title || shapeType}
          </p>
        </div>
      </div>

      {/* Tooltip on hover */}
      <div className="absolute invisible group-hover:visible bg-graphite/90 backdrop-blur-md border border-white/10 p-2 rounded-lg shadow-xl -bottom-12 left-1/2 -translate-x-1/2 z-[100] min-w-[120px] pointer-events-none">
        <p className="text-[11px] font-bold text-white m-0">{data.title || shapeType}</p>
        {data.description && (
          <p className="text-[9px] text-fog m-0 mt-1 line-clamp-2">{data.description}</p>
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
