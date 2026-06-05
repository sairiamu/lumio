import React from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const TextNode: React.FC<NodeProps<NodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      color="transparent"
      className="!shadow-none !border-none"
      style={{ backgroundColor: 'transparent' }}
    >
      <NodeResizer
        isVisible={props.selected}
        minWidth={60}
        minHeight={24}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--iris)', borderRadius: '50%' }}
        lineStyle={{ borderColor: 'var(--iris)', borderWidth: 1 }}
      />
    </BaseNode>
    
  );
};
