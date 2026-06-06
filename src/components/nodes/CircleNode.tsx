import React, { useEffect } from 'react';
import { NodeProps, NodeResizer, Node } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';
import { useCanvasStore } from '../../store/canvasStore';

export const CircleNode: React.FC<NodeProps<Node<NodeData>>> = (props) => {
  const { updateNodeData } = useCanvasStore();
  const data = props.data as NodeData;

  useEffect(() => {
    const w = (props.width as number) || 0;
    const h = (props.height as number) || 0;
    if (w && h && w !== h) {
      const size = Math.max(w, h);
      updateNodeData(props.id, { width: size, height: size });
    }
  }, [props.width, props.height, props.id, updateNodeData]);

  const showParams = ((props.width as number) ?? 0) >= 100;

  return (
    <BaseNode
      {...props}
      clayColor={data.clayColor}
      className="rounded-full w-[160px] h-[160px] flex items-center justify-center text-center"
      contentStyle={{
        padding: '8px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      hideHeader={true}
    >
      <div style={{
        flexShrink: 0,
        fontSize: 'clamp(12px, 4%, 16px)',
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
        overflow: 'hidden',
        width: '100%'
      }}>
        {data.title || 'Untitled'}
      </div>

      {showParams && data.parameters && data.parameters.length > 0 && (
        <div style={{ flexShrink: 0, overflow: 'hidden', width: '100%', marginTop: '2px' }}>
          {data.parameters.slice(0, 1).map((param, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'Inter' }}>{param.key}:</span>
              <span style={{ fontSize: '9px', color: 'var(--text)', fontWeight: 500, fontFamily: 'JetBrains Mono' }}>{param.value}</span>
            </div>
          ))}
        </div>
      )}

      {data.description && (
        <div style={{
          overflow: 'hidden',
          fontSize: '9px',
          fontFamily: 'Inter',
          fontWeight: 400,
          color: 'var(--text-muted)',
          lineHeight: 1.2,
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          wordBreak: 'break-word',
          width: '100%',
          marginTop: '2px'
        }}>
          {data.description}
        </div>
      )}

      <NodeResizer
        isVisible={!!props.selected}
        minWidth={60}
        minHeight={60}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--accent)', borderRadius: '50%', boxShadow: 'none' }}
        lineStyle={{ borderColor: 'var(--accent)', borderWidth: 1, boxShadow: 'none' }}
      />
    </BaseNode>
  );
};
