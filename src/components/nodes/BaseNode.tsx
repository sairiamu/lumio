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

export const BaseNode: React.FC<BaseNodeProps> = ({
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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<NodeData>(data);
  const { nodes, setNodes } = useCanvasStore();
  const editRef = useRef<HTMLDivElement>(null);
  const { glowNodeIds, trackedNodeId } = useTrackedRelations();

  const isTracked = glowNodeIds.includes(id);
  const isOrigin = trackedNodeId === id;

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
        border: '1.5px solid var(--border)',
        borderColor: data.strokeColor || 'var(--border)',
        boxShadow: isTracked
          ? isOrigin
            ? '0 0 0 3px var(--accent), 0 0 24px 6px var(--accent-light)'
            : '0 0 0 2px var(--success), 0 0 16px 4px rgba(52,211,153,0.3)'
          : 'none',
        transition: 'box-shadow 0.25s ease',
        ...style,
        width: '100%',
        height: '100%'
      }}
    >
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
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          boxSizing: 'border-box',
          ...contentStyle
        }}
        ref={editRef}
      >
        {isEditing ? (
          <div className="flex flex-col gap-2 min-w-[160px]" onKeyDown={handleKeyDown}>
            <input
              autoFocus
              className="bg-white/30 border-none rounded px-1.5 py-0.5 font-mono font-bold text-[13px] outline-none placeholder:text-text-muted"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Title"
            />
            <div className="flex flex-col gap-1">
              {(editData.parameters || []).map((param, i) => (
                <div key={i} className="flex gap-1 items-center">
                  <input
                    className="bg-white/20 border-none rounded px-1 text-[10px] w-1/3 outline-none"
                    value={param.key}
                    onChange={(e) => updateParam(i, 'key', e.target.value)}
                    placeholder="Key"
                  />
                  <span className="text-[10px]">:</span>
                  <input
                    className="bg-white/20 border-none rounded px-1 text-[10px] flex-1 outline-none"
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
              className="bg-white/20 border-none rounded px-1.5 py-1 font-sans text-[11px] outline-none resize-none placeholder:text-text-muted"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description"
              rows={2}
            />
          </div>
        ) : (
          <>
            {!hideHeader && (
              <p
                className="font-mono font-bold text-[14px] text-center m-0 w-full"
                style={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.3,
                  maxHeight: '100%',
                  overflow: 'hidden',
                }}
              >
                {data.title || 'Untitled'}
              </p>
            )}

            {data.parameters && data.parameters.length > 0 && (
              <div className="flex flex-col gap-1 w-full overflow-hidden">
                {data.parameters.map((param, i) => (
                  <p
                    key={i}
                    className="text-[10px] font-mono text-center m-0 w-full"
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.3,
                      maxHeight: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <span className="font-bold opacity-60 mr-1 uppercase tracking-tighter">{param.key}:</span>
                    <span className="font-medium">{param.value}</span>
                  </p>
                ))}
              </div>
            )}

            {data.description && (
              <p
                className="font-sans text-[11px] opacity-75 italic text-center m-0 w-full"
                style={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.3,
                  maxHeight: '100%',
                  overflow: 'hidden',
                }}
              >
                {data.description}
              </p>
            )}
            {children}
          </>
        )}
      </div>
    </div>
  );
};
