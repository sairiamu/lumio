import React from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const CardNode: React.FC<NodeProps<NodeData>> = (props) => {
  return (
    <BaseNode
      {...props}
      clayColor={props.data.clayColor}
      className="rounded-lg min-w-[220px] overflow-hidden"
      hideHeader={true}
      contentClassName="!p-0 !flex-col !justify-start"
    >
      <div className="w-full bg-white/10 p-2 px-3 border-b border-white/20">
        <p className="w-full font-bold text-[14px] truncate m-0">
          {props.data.title || 'Untitled'}
        </p>
      </div>
      <div className="w-full flex-grow p-3 overflow-hidden">
        <p
          className="w-full text-[12px] m-0"
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.3,
            maxHeight: '100%',
            overflow: 'hidden',
          }}
        >
          {props.data.description}
        </p>
      </div>
      <NodeResizer
        isVisible={props.selected}
        minWidth={120}
        minHeight={80}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--accent)', borderRadius: '50%', boxShadow: 'none' }}
        lineStyle={{ borderColor: 'var(--accent)', borderWidth: 1, boxShadow: 'none' }}
      />
    </BaseNode>
  );
};
