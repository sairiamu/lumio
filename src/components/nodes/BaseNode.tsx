import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NodeData } from '../../types';
import { useCanvasStore } from '../../store/canvasStore';

interface BaseNodeProps extends NodeProps<NodeData> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  data,
  selected,
  className = "",
  style,
  color = "#7EB8F7",
  contentClassName = "",
  contentStyle,
  children
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<NodeData>(data);
  const { nodes, setNodes } = useCanvasStore();
  const editRef = useRef<HTMLDivElement>(null);

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
      className={`clay-shape relative ${selected ? 'ring-2 ring-iris ring-offset-2 ring-offset-void' : ''} ${className}`}
      style={{
        backgroundColor: color,
        borderColor: data.strokeColor || 'rgba(255,255,255,0.2)',
        boxShadow: `6px 6px 0px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.3)`,
        ...style,
        width: '100%',
        height: '100%'
      }}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-mint border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-mint border-none" />
      <Handle type="target" position={Position.Left} className="w-1.5 h-1.5 !bg-mint border-none" />
      <Handle type="source" position={Position.Right} className="w-1.5 h-1.5 !bg-mint border-none" />

      <div className={`p-4 text-void flex flex-col ${contentClassName}`} style={contentStyle} ref={editRef}>
        {isEditing ? (
          <div className="flex flex-col gap-2 min-w-[160px]" onKeyDown={handleKeyDown}>
            <input
              autoFocus
              className="bg-white/30 border-none rounded px-1.5 py-0.5 font-mono font-bold text-[13px] outline-none placeholder:text-void/40"
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
              className="bg-white/20 border-none rounded px-1.5 py-1 font-sans text-[11px] outline-none resize-none placeholder:text-void/40"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description"
              rows={2}
            />
          </div>
        ) : (
          <>
            <div className="font-mono font-bold text-[14px] leading-tight mb-2 border-b border-void/10 pb-1">
              {data.title || 'Untitled'}
            </div>

            {data.parameters && data.parameters.length > 0 && (
              <div className="flex flex-col gap-1 mb-2">
                {data.parameters.map((param, i) => (
                  <div key={i} className="flex text-[10px] font-mono items-baseline">
                    <span className="font-bold opacity-60 mr-1.5 uppercase tracking-tighter">{param.key}:</span>
                    <span className="font-medium">{param.value}</span>
                  </div>
                ))}
              </div>
            )}

            {data.description && (
              <div className="font-sans text-[11px] opacity-75 leading-snug italic">
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
