import React from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const CardNode: React.FC<NodeProps<NodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      color={props.data.color}
      className="rounded-lg min-w-[220px] shadow-xl"
    >
      <NodeResizer
        isVisible={props.selected}
        minWidth={120}
        minHeight={80}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--accent)', borderRadius: '50%' }}
        lineStyle={{ borderColor: 'var(--accent)', borderWidth: 1 }}
      />
    </BaseNode>
  );
};
