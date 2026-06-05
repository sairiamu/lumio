import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const CircleNode: React.FC<NodeProps<NodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      color={props.data.color}
      className="rounded-full w-[160px] h-[160px] flex items-center justify-center text-center"
      contentClassName="w-full"
    />
  );
};
