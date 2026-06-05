import React, { useEffect } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { NodeData } from '../../types';
import { useCanvasStore } from '../../store/canvasStore';

export const CircleNode: React.FC<NodeProps<NodeData>> = (props) => {
  const { updateNodeData } = useCanvasStore();

  useEffect(() => {
    const w = props.width || 0;
    const h = props.height || 0;
    if (w && h && w !== h) {
      const size = Math.max(w, h);
      updateNodeData(props.id, { width: size, height: size });
    }
  }, [props.width, props.height, props.id, updateNodeData]);

  return (
    <BaseNode
      {...props}
      color={props.data.color}
      className="rounded-full w-[160px] h-[160px] flex items-center justify-center text-center"
      contentClassName="w-full"
    >
      <NodeResizer
        isVisible={props.selected}
        minWidth={60}
        minHeight={60}
        handleStyle={{ width: 10, height: 10, backgroundColor: 'var(--iris)', borderRadius: '50%' }}
        lineStyle={{ borderColor: 'var(--iris)', borderWidth: 1 }}
      />
    </BaseNode>
  );
};
