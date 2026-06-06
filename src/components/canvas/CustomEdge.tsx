import React from 'react';
import { EdgeProps, getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/react';
import { useTrackedRelations } from '../../hooks/useTrackedRelations';
import { EdgeData } from '../../types';

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  source: _source,
  target: _target,
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
  selected: _selected,
}) => {
  const edgeData = data as EdgeData;
  const pathType = edgeData?.pathType || 'default';

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

  const { glowEdgeIds, edgeColourMap } = useTrackedRelations();
  const isTrackedGlowing = glowEdgeIds.includes(id);
  const glowColor = edgeColourMap[id] || 'var(--accent)';

  const strokeColor: string = edgeData?.strokeColor || 'var(--text-muted)';
  const strokeWidth: number = edgeData?.strokeWidth || 2;
  const dashArray =
    edgeData?.strokeStyle === 'dashed' ? '8 4' :
    edgeData?.strokeStyle === 'dotted' ? '2 4' :
    undefined;

  return (
    <>
      <path
        id={id + '_glow'}
        d={edgePath}
        stroke={glowColor}
        strokeWidth={(strokeWidth as number) + 8}
        opacity={isTrackedGlowing ? 0.5 : 0}
        filter="url(#edge-glow)"
        fill="none"
        style={{ transition: 'opacity 0.25s ease', pointerEvents: 'none' }}
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
