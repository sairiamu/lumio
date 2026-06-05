import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const DiamondNode: React.FC<NodeProps<NodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      color={props.data.color}
      className="w-[180px] h-[180px] rotate-45 flex items-center justify-center text-center"
      contentClassName="-rotate-45 p-6"
    />
  );
};
