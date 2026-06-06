import React from 'react';
import { EdgeProps, getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/react';
import { useTrackedRelations } from '../../hooks/useTrackedRelations';
import { EdgeData } from '../../types';
import { useCanvasStore } from '../../store/canvasStore';

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
  const pulsingNodeId = useCanvasStore((state) => state.pulsingNodeId);
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

  const isPulsing = pulsingNodeId === _source || pulsingNodeId === _target;
  const animationType = isPulsing ? 'signal' : (edgeData?.animationType || 'none');
  const animationSpeed = edgeData?.animationSpeed || 'normal';
  const animationColor = isPulsing ? 'var(--accent)' : (edgeData?.animationColor || strokeColor);

  const speedMs = animationSpeed === 'slow' ? 2000 : animationSpeed === 'fast' ? 400 : 1000;

  const dashArray =
    animationType === 'dash-march' ? '8 4' :
    edgeData?.strokeStyle === 'dashed' ? '8 4' :
    edgeData?.strokeStyle === 'dotted' ? '2 4' :
    undefined;

  const pathStyle: React.CSSProperties = {
    ...style,
    animationPlayState: 'var(--animation-state, running)' as any,
  };

  if (animationType === 'dash-march') {
    pathStyle.animation = `marchDash ${speedMs}ms linear infinite`;
    pathStyle.animationPlayState = 'var(--animation-state, running)' as any;
  } else if (animationType === 'pulse') {
    pathStyle.animation = `pulseEdge ${speedMs}ms ease-in-out infinite`;
    pathStyle.animationPlayState = 'var(--animation-state, running)' as any;
  }

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
        style={pathStyle}
        d={edgePath}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        fill="none"
        markerEnd={markerEnd}
        markerStart={markerStart}
        className="react-flow__edge-path"
      />
      {animationType === 'flow' && (
        <>
          <circle r="4" fill={animationColor}>
            <animateMotion
              dur={`${speedMs}ms`}
              repeatCount="indefinite"
              path={edgePath}
              style={{ animationPlayState: 'var(--animation-state, running)' } as any}
            />
          </circle>
          <circle r="4" fill={animationColor} opacity="0.6">
            <animateMotion
              dur={`${speedMs}ms`}
              repeatCount="indefinite"
              begin={`${speedMs * 0.33}ms`}
              path={edgePath}
              style={{ animationPlayState: 'var(--animation-state, running)' } as any}
            />
          </circle>
          <circle r="4" fill={animationColor} opacity="0.3">
            <animateMotion
              dur={`${speedMs}ms`}
              repeatCount="indefinite"
              begin={`${speedMs * 0.66}ms`}
              path={edgePath}
              style={{ animationPlayState: 'var(--animation-state, running)' } as any}
            />
          </circle>
        </>
      )}
      {animationType === 'signal' && (
        <circle r="6" fill={animationColor || 'var(--accent)'} filter="url(#signal-glow)">
          <animateMotion
            dur={`${speedMs * 2}ms`}
            repeatCount="indefinite"
            path={edgePath}
            style={{ animationPlayState: 'var(--animation-state, running)' } as any}
          />
        </circle>
      )}
    </>
  );
};
