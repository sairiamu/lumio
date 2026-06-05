import React from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const DiamondNode: React.FC<NodeProps<NodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      clayColor={props.data.clayColor}
      className="w-[180px] h-[180px] rotate-45 flex items-center justify-center text-center"
      contentClassName="-rotate-45"
      contentStyle={{
        width: 'calc(100% * 0.7)',
        height: 'calc(100% * 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <NodeResizer
        isVisible={props.selected}
        minWidth={70}
        minHeight={70}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--accent)', borderRadius: '50%', boxShadow: 'none' }}
        lineStyle={{ borderColor: 'var(--accent)', borderWidth: 1, boxShadow: 'none' }}
      />
    </BaseNode>
  );
};
