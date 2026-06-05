import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const TextNode: React.FC<NodeProps<NodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      color="transparent"
      className="!shadow-none !border-none"
      style={{ backgroundColor: 'transparent' }}
    />
  );
};
