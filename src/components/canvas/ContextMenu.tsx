import React, { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useReactFlow } from '@xyflow/react';
import { Waypoints, Presentation, Trash2, Group, Ungroup } from 'lucide-react';

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  targetNodeId?: string | null;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ visible, x, y, targetNodeId, onClose }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const {
    nodes,
    edges,
    setNodes,
    updateNodeData,
    trackedNodeId,
    setTrackedNodeId,
    addToStepNodes,
    clearStepNodes,
    selectedNodeIds,
    groupSelectedNodes,
    ungroupSelectedNodes
  } = useCanvasStore();
  const { deleteElements, fitView } = useReactFlow();
  const [clampedPos, setClampedPos] = useState({ left: x, top: y });
  const [hasPaste, setHasPaste] = useState(false);
  const [showColourPicker, setShowColourPicker] = useState(false);
  const [tempColour, setTempColour] = useState('var(--accent-light)');

  useEffect(() => {
    if (!visible) return;

    // check clipboard for a copied node
    (async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (!text) {
          setHasPaste(false);
          return;
        }
        const parsed = JSON.parse(text);
        // basic heuristic: object with type and data
        if (parsed && (parsed.type || parsed.data)) {
          setHasPaste(true);
        } else {
          setHasPaste(false);
        }
      } catch {
        setHasPaste(false);
      }
    })();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    // clamp position after mount so menu doesn't overflow
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pageW = window.innerWidth;
      const pageH = window.innerHeight;
      let left = x;
      let top = y;
      if (left + rect.width > pageW - 8) left = Math.max(8, pageW - rect.width - 8);
      if (top + rect.height > pageH - 8) top = Math.max(8, pageH - rect.height - 8);
      setClampedPos({ left, top });
    });
  }, [visible, x, y]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClick = (e: MouseEvent) => {
      const el = ref.current;
      if (el && !el.contains(e.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      window.addEventListener('keydown', handleKey);
      window.addEventListener('click', handleClick);
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('click', handleClick);
    };
  }, [visible, onClose]);

  const close = () => onClose();

  const handleDuplicate = () => {
    if (!targetNodeId) return;
    const node = nodes.find((n) => n.id === targetNodeId);
    if (!node) return;
    const newNode = {
      ...node,
      id: `node_${Date.now()}`,
      position: { x: (node.position as any).x + 24, y: (node.position as any).y + 24 },
    } as any;
    setNodes([...nodes, newNode]);
    close();
  };

  const handleTrackRelations = () => {
    if (!targetNodeId) return;
    if (trackedNodeId === targetNodeId) {
      setTrackedNodeId(null);
    } else {
      setTrackedNodeId(targetNodeId);
    }
    close();
  };

  const handleEditProperties = () => {
    if (!targetNodeId) return;
    // mark the node as selected and open properties (PropertiesPanel reads selectedNodeIds)
    const updated = nodes.map((n) => ({ ...n, selected: n.id === targetNodeId }));
    // set nodes and selectedNodeIds together
    useCanvasStore.setState({ nodes: updated, selectedNodeIds: [targetNodeId] });
    // try to focus properties panel if present
    const panel = document.querySelector('.glass-panel');
    (panel as HTMLElement | null)?.focus?.();
    close();
  };

  const handleOpenColour = () => {
    if (!targetNodeId) return;
    const node = nodes.find((n) => n.id === targetNodeId);
    setTempColour((node?.data?.clayColor as string) || 'var(--accent-light)');
    setShowColourPicker(true);
  };

  const applyColour = () => {
    if (!targetNodeId) return;
    updateNodeData(targetNodeId, { clayColor: tempColour });
    setShowColourPicker(false);
    close();
  };

  const handleDelete = () => {
    if (!targetNodeId) return;
    const node = nodes.find((n) => n.id === targetNodeId);
    if (!node) return;
    const edgesToDelete = edges.filter((e) => e.source === targetNodeId || e.target === targetNodeId);
    deleteElements({ nodes: [node], edges: edgesToDelete });
    // remove from store
    const newNodes = nodes.filter((n) => n.id !== targetNodeId);
    const newEdges = edges.filter((e) => e.source !== targetNodeId && e.target !== targetNodeId);
    useCanvasStore.setState({ nodes: newNodes, edges: newEdges, selectedNodeIds: [] });
    close();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      if (!parsed) return;
      // basic node paste: reuse type/data and position at center
      const newNode = {
        ...parsed,
        id: `node_${Date.now()}`,
        position: { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 40 },
      } as any;
      setNodes([...nodes, newNode]);
      close();
    } catch {
      // ignore
    }
  };

  const handleSelectAll = () => {
    const allIds = nodes.map((n) => n.id);
    const updated = nodes.map((n) => ({ ...n, selected: true }));
    useCanvasStore.setState({ nodes: updated, selectedNodeIds: allIds });
    close();
  };

  const handleFitView = () => {
    fitView();
    close();
  };

  const handleSaveAsTemplate = () => {
    const name = window.prompt('Enter template name:');
    if (name) {
      const newTemplate = {
        id: `custom_${Date.now()}`,
        name,
        description: 'Custom user template',
        category: 'Custom',
        thumbnail: '⭐',
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
      };
      useCanvasStore.getState().addCustomTemplate(newTemplate);
    }
    close();
  };

  const handleAddToPresentation = () => {
    if (targetNodeId) {
      addToStepNodes(targetNodeId);
    }
    close();
  };

  const handleClearPresentation = () => {
    clearStepNodes();
    close();
  };

  if (!visible) return null;

  const targetNode = nodes.find(n => n.id === targetNodeId);
  const isGroupNode = targetNode?.type === 'group';
  const canGroup = selectedNodeIds.length >= 2;

  return (
    <div
      ref={ref}
      className="absolute z-50 p-2 glass-panel w-44 text-sm text-text shadow-2xl"
      style={{ left: clampedPos.left, top: clampedPos.top }}
      role="menu"
    >
      {targetNodeId ? (
        <div className="flex flex-col">
          {isGroupNode ? (
            <button
              className="flex items-center gap-2 text-left px-3 py-2 hover:bg-white/10 rounded transition-colors text-accent"
              onClick={() => { ungroupSelectedNodes(); close(); }}
            >
              <Ungroup size={16} />
              Ungroup
            </button>
          ) : canGroup ? (
            <button
              className="flex items-center gap-2 text-left px-3 py-2 hover:bg-white/10 rounded transition-colors text-accent"
              onClick={() => { groupSelectedNodes(); close(); }}
            >
              <Group size={16} />
              Group Selection
            </button>
          ) : null}

          <div className="my-1 border-t border-white/5" />

          <button className="text-left px-3 py-2 hover:bg-white/10 rounded transition-colors" onClick={handleDuplicate}>Duplicate Node</button>
          <button
            className="flex items-center gap-2 text-left px-3 py-2 hover:bg-white/10 rounded transition-colors"
            style={{ color: 'var(--accent)' }}
            onClick={handleTrackRelations}
          >
            <Waypoints size={16} />
            Track Relations
          </button>
          <button
            className="flex items-center gap-2 text-left px-3 py-2 hover:bg-white/10 rounded transition-colors"
            onClick={handleAddToPresentation}
          >
            <Presentation size={16} className="text-accent" />
            Add to Presentation
          </button>
          <button className="text-left px-3 py-2 hover:bg-white/10 rounded transition-colors" onClick={handleEditProperties}>Edit Properties</button>
          <button className="text-left px-3 py-2 hover:bg-white/10 rounded transition-colors" onClick={handleOpenColour}>Change Colour</button>
          {showColourPicker && (
            <div className="px-3 py-2">
              <input type="color" value={tempColour} onChange={(e) => setTempColour(e.target.value)} className="w-full h-8 p-0 m-0 cursor-pointer" />
              <div className="flex gap-2 mt-2">
                <button className="flex-1 py-1 bg-accent text-white rounded transition-colors hover:opacity-90" onClick={applyColour}>Apply</button>
                <button className="flex-1 py-1 bg-white/10 text-text rounded transition-colors hover:bg-white/20" onClick={() => setShowColourPicker(false)}>Cancel</button>
              </div>
            </div>
          )}
          <button className="text-left px-3 py-2 rounded mt-1 text-danger hover:bg-danger/10 transition-colors" onClick={handleDelete}>Delete Node</button>
        </div>
      ) : (
        <div className="flex flex-col">
          <button className="text-left px-3 py-2 hover:bg-white/10 rounded transition-colors disabled:opacity-30" onClick={handlePaste} disabled={!hasPaste}>Paste</button>
          <button className="text-left px-3 py-2 hover:bg-white/10 rounded transition-colors" onClick={handleSelectAll}>Select All</button>
          <button className="text-left px-3 py-2 hover:bg-white/10 rounded transition-colors" onClick={handleFitView}>Fit View</button>
          <button
            className="flex items-center gap-2 text-left px-3 py-2 hover:bg-white/10 rounded transition-colors text-danger"
            onClick={handleClearPresentation}
          >
            <Trash2 size={16} />
            Clear Presentation Order
          </button>
          <div className="my-1 border-t border-border" />
          <button className="text-left px-3 py-2 hover:bg-white/10 rounded transition-colors text-accent font-medium" onClick={handleSaveAsTemplate}>Save as Template</button>
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
