import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NodeData } from '../../types';
import { useCanvasStore } from '../../store/canvasStore';
import { useTrackedRelations } from '../../hooks/useTrackedRelations';

interface BaseNodeProps extends NodeProps<NodeData> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  clayColor?: string;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  hideHeader?: boolean;
}

export const BaseNode: React.FC<BaseNodeProps> = (props) => {
  const {
    id,
    data,
    selected,
    className = "",
    style,
    clayColor = "var(--node-default-bg)",
    contentClassName = "",
    contentStyle,
    hideHeader = false,
    children
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<NodeData>(data);
  const { nodes, setNodes, isPresentationMode, stepNodes, currentStep, searchQuery, searchResults } = useCanvasStore();
  const editRef = useRef<HTMLDivElement>(null);
  const { glowNodeIds, trackedNodeId } = useTrackedRelations();

  const isTracked = glowNodeIds.includes(id);
  const isOrigin = trackedNodeId === id;

  const stepIndex = stepNodes.indexOf(id);
  const isInStepOrder = stepIndex !== -1;
  const isCurrentStep = isInStepOrder && currentStep === stepIndex;

  const isSearchActive = searchQuery.length > 0;
  const isMatch = isSearchActive && searchResults.includes(id);

  // Opacity logic: if in presentation mode and stepping, dim other nodes
  let opacity = 1;
  if (isPresentationMode && currentStep !== -1 && !isCurrentStep) {
    opacity = 0.2;
  } else if (isSearchActive && !isMatch) {
    opacity = 0.25;
  }

  const { width: measuredWidth = 150, height: measuredHeight = 80 } = props as any;

  const scale = Math.min(measuredWidth / 150, measuredHeight / 80);
  const titleSize = Math.max(11, Math.min(17, 14 * scale));
  const bodySize = Math.max(9, Math.min(12, 10 * scale));

  const hasParams = data.parameters && data.parameters.length > 0;
  const hasDesc = !!data.description;
  const showDivider = !hideHeader && (hasParams || hasDesc);

  const [editingParamIndex, setEditingParamIndex] = useState<number | null>(null);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditData(data);
  }, [data]);

  const handleCommit = useCallback(() => {
    if (!isEditing) return;
    setIsEditing(false);

    // Update store
    const updatedNodes = nodes.map((n) => {
      if (n.id === id) {
        return { ...n, data: { ...n.data, ...editData } };
      }
      return n;
    });
    setNodes(updatedNodes);
  }, [id, editData, nodes, setNodes, isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditing && editRef.current && !editRef.current.contains(event.target as Node)) {
        handleCommit();
      }
    };
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, handleCommit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditData(data);
    }
  };

  const updateParam = (index: number, keyOrValue: 'key' | 'value', val: string) => {
    const newParams = [...(editData.parameters || [])];
    newParams[index] = { ...newParams[index], [keyOrValue]: val };
    setEditData({ ...editData, parameters: newParams });
  };

  const addParam = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditData({
      ...editData,
      parameters: [...(editData.parameters || []), { key: '', value: '' }]
    });
  };

  const removeParam = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newParams = (editData.parameters || []).filter((_, i) => i !== index);
    setEditData({ ...editData, parameters: newParams });
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`clay-shape relative ${selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''} ${className}`}
      style={{
        backgroundColor: data.clayColor || clayColor,
        border: isMatch ? '2px solid var(--success)' : (data.strokeColor ? `1.5px solid ${data.strokeColor}` : '1.5px solid var(--border)'),
        boxShadow: isCurrentStep
          ? '0 0 0 3px var(--accent), 0 0 32px 8px var(--accent-light)'
          : isTracked
            ? isOrigin
              ? '0 0 0 3px var(--accent), 0 0 24px 6px var(--accent-light)'
              : '0 0 0 2px var(--success), 0 0 16px 4px rgba(52,211,153,0.3)'
            : 'none',
        opacity: opacity,
        transition: 'all 0.4s ease-in-out',
        ...style,
        width: '100%',
        height: '100%'
      }}
    >
      {isInStepOrder && (
        <div
          className="absolute -top-2 -right-2 w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border border-white/20 z-50 animate-in zoom-in duration-300"
        >
          {stepIndex + 1}
        </div>
      )}
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-success border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-success border-none" />
      <Handle type="target" position={Position.Left} className="w-1.5 h-1.5 !bg-success border-none" />
      <Handle type="source" position={Position.Right} className="w-1.5 h-1.5 !bg-success border-none" />

      <div
        className={`text-text ${contentClassName}`}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          boxSizing: 'border-box',
          gap: '4px',
          ...contentStyle
        }}
        ref={editRef}
      >
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full h-full" onKeyDown={handleKeyDown}>
            <textarea
              autoFocus
              className="w-full bg-transparent border-none p-0 m-0 outline-none resize-none text-center"
              style={{
                fontSize: titleSize,
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.2
              }}
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Title"
              rows={2}
            />

            <div className="flex flex-col gap-1 w-full overflow-hidden">
              {(editData.parameters || []).map((param, i) => (
                <div key={i} className="flex gap-1 items-center">
                  <input
                    className="bg-white/10 border-none rounded px-1 text-[10px] w-1/3 outline-none"
                    value={param.key}
                    onChange={(e) => updateParam(i, 'key', e.target.value)}
                    placeholder="Key"
                  />
                  <span className="text-[10px]">:</span>
                  <input
                    className="bg-white/10 border-none rounded px-1 text-[10px] flex-1 outline-none"
                    value={param.value}
                    onChange={(e) => updateParam(i, 'value', e.target.value)}
                    placeholder="Value"
                  />
                  <button onClick={(e) => removeParam(e, i)} className="text-[12px] leading-none opacity-50 hover:opacity-100 px-0.5">×</button>
                </div>
              ))}
              <button
                onClick={addParam}
                className="text-[10px] text-left opacity-60 hover:opacity-100 mt-1 font-medium"
              >
                + Add Parameter
              </button>
            </div>

            <textarea
              className="w-full bg-transparent border-none p-0 m-0 outline-none resize-none flex-grow"
              style={{
                fontSize: bodySize,
                fontFamily: 'Inter',
                fontWeight: 400,
                color: 'var(--text-muted)',
                lineHeight: 1.4
              }}
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description"
            />
          </div>
        ) : (
          <>
            {!hideHeader && (
              <div style={{
                flexShrink: 0,
                fontSize: titleSize,
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
                {data.title || 'Untitled'}
              </div>
            )}

            {showDivider && (
              <div style={{ height: '1px', background: 'var(--border)', margin: '2px 0', flexShrink: 0 }} />
            )}

            {hasParams && !hideHeader && (
              <div style={{ flexShrink: 0, overflow: 'hidden' }}>
                {data.parameters?.slice(0, 3).map((param, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}
                  >
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'Inter', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{param.key}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text)', fontWeight: 500, fontFamily: 'JetBrains Mono', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{param.value}</span>
                  </div>
                ))}
                {data.parameters && data.parameters.length > 3 && (
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'right' }}>+{data.parameters.length - 3} more</div>
                )}
              </div>
            )}

            {hasDesc && !hideHeader && (
              <div style={{
                flexGrow: 1,
                overflow: 'hidden',
                fontSize: bodySize,
                fontFamily: 'Inter',
                fontWeight: 400,
                color: 'var(--text-muted)',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word'
              }}>
                {data.description}
              </div>
            )}
            {children}
          </>
        )}
      </div>
    </div>
  );
};
