import React from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';
import * as LucideIcons from 'lucide-react';

export const UniversalNode: React.FC<NodeProps<NodeData>> = (props) => {
  const shapeType = (props.data.shapeType as string) || 'Database';
  // Fallback to Box if icon not found
  const IconComponent = (LucideIcons as any)[shapeType] || LucideIcons.Box;

  return (
    <BaseNode
      {...props}
      clayColor={props.data.clayColor || 'var(--accent-light)'}
      className="rounded-[20px] flex items-center justify-center min-w-[80px] min-h-[80px]"
      contentClassName="items-center justify-center"
      hideHeader={true}
    >
      <div className="flex flex-col items-center justify-center gap-2" style={{ color: 'var(--text)' }}>
        <IconComponent size={28} color="currentColor" />
        <div className="text-[12px] font-bold text-center leading-tight">
          {props.data.title || shapeType}
        </div>
      </div>
      <NodeResizer
        isVisible={props.selected}
        minWidth={60}
        minHeight={60}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--accent)', borderRadius: '50%' }}
        lineStyle={{ borderColor: 'var(--accent)', borderWidth: 1 }}
      />
    </BaseNode>
  );
};
