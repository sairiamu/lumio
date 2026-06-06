import React from 'react';
import { NodeProps, NodeResizer, Node } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const TextNode: React.FC<NodeProps<Node<NodeData>>> = (props) => {
  return (
    <BaseNode
      {...props}
      clayColor="transparent"
      className="!shadow-none"
      style={{ backgroundColor: 'transparent' }}
    >
      <NodeResizer
        isVisible={!!props.selected}
        minWidth={60}
        minHeight={24}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--accent)', borderRadius: '50%', boxShadow: 'none' }}
        lineStyle={{ borderColor: 'var(--accent)', borderWidth: 1, boxShadow: 'none' }}
      />
    </BaseNode>
    
  );
};
