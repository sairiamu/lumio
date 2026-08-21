import React from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';

export const WireEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data = {},
  selected,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const wireColor = (data as any)?.color || '#ff0000';
  const strokeWidth = selected ? 4 : 2;

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: selected ? 'var(--accent)' : wireColor,
          strokeWidth: strokeWidth + 2,
          opacity: 0.3,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
      />
      <path
        id={id + '_inner'}
        style={{
          ...style,
          stroke: wireColor,
          strokeWidth: strokeWidth,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
      />
    </>
  );
};
