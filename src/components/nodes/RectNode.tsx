import React from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const RectNode: React.FC<NodeProps<NodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      clayColor={props.data.clayColor}
      className="rounded-[16px] min-w-[180px]"
    >
      <NodeResizer
        isVisible={props.selected}
        minWidth={80}
        minHeight={40}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--accent)', borderRadius: '50%', boxShadow: 'none' }}
        lineStyle={{ borderColor: 'var(--accent)', borderWidth: 1, boxShadow: 'none' }}
      />
    </BaseNode>
   
  );
};
