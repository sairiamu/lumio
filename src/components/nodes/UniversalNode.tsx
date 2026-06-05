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
      contentClassName="!p-0"
      hideHeader={true}
    >
      <div className="w-full h-full flex flex-col" style={{ color: 'var(--text)' }}>
        <div className="h-[60%] flex items-center justify-center">
          <IconComponent size={32} color="currentColor" />
        </div>
        <div className="h-[40%] overflow-hidden px-1 flex items-center justify-center">
          <p
            className="m-0 text-center w-full"
            style={{
              fontSize: 'clamp(9px, 1.5vw, 13px)',
              fontWeight: 'bold',
              lineHeight: 1.2,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              maxHeight: '100%',
              overflow: 'hidden',
            }}
          >
            {props.data.title || shapeType}
          </p>
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
