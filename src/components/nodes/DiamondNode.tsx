import React from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const DiamondNode: React.FC<NodeProps<NodeData>> = (props) => {
  const maxSide = Math.max(props.width || 0, props.height || 0) || 180;
  const inner = Math.max(maxSide * 0.7, 0);

  return (
    <BaseNode
      {...props}
      color={props.data.color}
      className="w-[180px] h-[180px] rotate-45 flex items-center justify-center text-center"
      contentClassName="-rotate-45 p-6"
      contentStyle={{ width: inner, height: inner }}
    >
      <NodeResizer
        isVisible={props.selected}
        minWidth={70}
        minHeight={70}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--accent)', borderRadius: '50%' }}
        lineStyle={{ borderColor: 'var(--accent)', borderWidth: 1 }}
      />
    </BaseNode>
  );
};
