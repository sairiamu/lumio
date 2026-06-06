import React from 'react';
import { NodeProps, NodeResizer, Node } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';

export const CardNode: React.FC<NodeProps<Node<NodeData>>> = (props) => {
  const data = props.data as NodeData;
  const hasParams = data.parameters && data.parameters.length > 0;
  const maxParams = 4;

  return (
    <BaseNode
      {...props}
      clayColor={data.clayColor}
      className="rounded-lg min-w-[220px] overflow-hidden"
      hideHeader={true}
      contentClassName="!p-0 !flex-col !justify-start"
    >
      <div
        className="w-full p-2 px-3 border-b border-white/20 flex-shrink-0"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      >
        <p className="w-full font-bold text-[14px] truncate m-0" style={{ fontFamily: 'Sora, sans-serif' }}>
          {data.title || 'Untitled'}
        </p>
      </div>

      <div className="w-full flex-grow p-3 overflow-hidden flex flex-col gap-2">
        {hasParams && (
          <div className="flex flex-col gap-1">
            {data.parameters?.slice(0, maxParams).map((param, i) => (
              <div key={i} className="flex justify-between items-center text-[11px]">
                <label className="text-fog font-medium">{param.key}</label>
                <span className="text-cloud font-mono">{param.value}</span>
              </div>
            ))}
            {data.parameters && data.parameters.length > maxParams && (
              <div className="text-[10px] text-fog text-right italic">
                +{data.parameters.length - maxParams} more
              </div>
            )}
          </div>
        )}

        {data.description && (
          <p
            className="w-full text-[11px] m-0 italic text-fog"
            style={{
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {data.description}
          </p>
        )}
      </div>

      <NodeResizer
        isVisible={!!props.selected}
        minWidth={120}
        minHeight={80}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--accent)', borderRadius: '50%', boxShadow: 'none' }}
        lineStyle={{ borderColor: 'var(--accent)', borderWidth: 1, boxShadow: 'none' }}
      />
    </BaseNode>
  );
};
