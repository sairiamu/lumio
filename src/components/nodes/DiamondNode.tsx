import React from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const DiamondNode: React.FC<NodeProps<NodeData>> = (props) => {
  const showParams = (props.width ?? 0) > 140;

  return (
    <BaseNode
      {...props}
      clayColor={props.data.clayColor}
      className="w-[180px] h-[180px] rotate-45 flex items-center justify-center text-center"
      contentClassName="-rotate-45"
      contentStyle={{
        width: '70%',
        height: '70%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      hideHeader={!showParams}
    >
      {!showParams && (
        <div style={{
          flexShrink: 0,
          fontSize: 'clamp(11px, 4%, 15px)',
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          color: 'var(--text)',
          textAlign: 'center',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          lineHeight: 1.2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {props.data.title || 'Untitled'}
        </div>
      )}
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
