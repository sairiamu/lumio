import React from 'react';
import { EdgeProps, getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/react';
import { useCanvasStore } from '../../store/canvasStore';

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  markerStart,
  data = {},
  selected,
}) => {
  const pathType = data?.pathType || 'default';

  let edgePath = '';
  const pathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  if (pathType === 'straight') {
    [edgePath] = getStraightPath(pathParams);
  } else if (pathType === 'smoothstep') {
    [edgePath] = getSmoothStepPath(pathParams);
  } else {
    [edgePath] = getBezierPath(pathParams);
  }

  const selectedNodeIds = useCanvasStore((s) => s.selectedNodeIds);
  const selectedEdgeIds = useCanvasStore((s) => s.selectedEdgeIds);

  const isGlowing =
    selected ||
    selectedEdgeIds.includes(id) ||
    selectedNodeIds.includes(source) ||
    selectedNodeIds.includes(target);

  const strokeColor = data.strokeColor || 'var(--text-muted)';
  const strokeWidth = data.strokeWidth || 2;
  const dashArray =
    data.strokeStyle === 'dashed' ? '8 4' :
    data.strokeStyle === 'dotted' ? '2 4' :
    undefined;

  return (
    <>
      <path
        id={id + '_glow'}
        d={edgePath}
        stroke={strokeColor}
        strokeWidth={(strokeWidth as number) + 6}
        opacity={isGlowing ? 0.35 : 0}
        filter="url(#edge-glow)"
        fill="none"
        style={{ transition: 'opacity 0.2s ease', pointerEvents: 'none' }}
      />
      <path
        id={id}
        style={style}
        d={edgePath}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        fill="none"
        markerEnd={markerEnd}
        markerStart={markerStart}
        className="react-flow__edge-path"
      />
    </>
  );
};
