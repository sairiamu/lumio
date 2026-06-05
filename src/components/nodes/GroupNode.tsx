import React, { useState } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { useCanvasStore } from '../../store/canvasStore';

export const GroupNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Group');
  const { nodes, setNodes, searchQuery, searchResults } = useCanvasStore();

  const isSearchActive = searchQuery.length > 0;
  const isMatch = isSearchActive && searchResults.includes(id);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setNodes(nodes.map(n => n.id === id ? { ...n, data: { ...n.data, title } } : n));
  };

  const handleUngroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    const groupNode = nodes.find(n => n.id === id);
    if (!groupNode) return;

    const updatedNodes = nodes.map(n => {
      if (n.parentId === id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { parentId, extent, ...rest } = n;
        return {
          ...rest,
          position: {
            x: n.position.x + groupNode.position.x,
            y: n.position.y + groupNode.position.y
          }
        };
      }
      return n;
    }).filter(n => n.id !== id);

    setNodes(updatedNodes);
  };

  return (
    <div
      className={`group-node rounded-2xl border-2 border-dashed h-full w-full relative transition-all duration-300 ${
        selected ? 'ring-2 ring-accent/20' : ''
      }`}
      style={{
        backgroundColor: 'var(--accent-light)',
        border: isMatch ? '2px solid var(--success)' : '2px dashed var(--accent)',
        opacity: isSearchActive && !isMatch ? 0.25 : 1,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
        {isEditing ? (
          <input
            autoFocus
            className="bg-transparent border-none outline-none font-mono font-bold text-sm text-accent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
          />
        ) : (
          <span className="font-mono font-bold text-sm text-accent/80 select-none">
            {data.title || 'Group'}
          </span>
        )}
      </div>

      <button
        onClick={handleUngroup}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-accent/10 text-accent/40 hover:text-accent transition-all z-10"
        title="Ungroup"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <NodeResizer
        isVisible={selected}
        minWidth={100}
        minHeight={100}
        handleStyle={{ width: 8, height: 8, backgroundColor: 'var(--accent)', borderRadius: '2px' }}
        lineStyle={{ borderColor: 'var(--accent)', borderWidth: 1 }}
      />
    </div>
  );
};
