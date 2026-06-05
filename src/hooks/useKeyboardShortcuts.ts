import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useCanvasStore } from '../store/canvasStore';

export const useKeyboardShortcuts = () => {
  const { deleteElements } = useReactFlow();
  const {
    selectedNodeIds,
    nodes,
    edges,
    setCurrentTool,
    setExportModalOpen,
    isExportModalOpen,
    undo,
    saveJSON,
    deselectAll
  } = useCanvasStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Meta/Ctrl shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'e':
            e.preventDefault();
            setExportModalOpen(true);
            break;
          case 'z':
            e.preventDefault();
            undo();
            break;
          case 's':
            e.preventDefault();
            saveJSON();
            break;
        }
        return;
      }

      // Single key shortcuts
      switch (e.key.toLowerCase()) {
        case 'v':
          setCurrentTool('select');
          break;
        case 'r':
          setCurrentTool('rect');
          break;
        case 'c':
          setCurrentTool('circle');
          break;
        case 'd':
          setCurrentTool('diamond');
          break;
        case 't':
          setCurrentTool('text');
          break;
        case 'delete':
        case 'backspace':
          if (selectedNodeIds.length > 0) {
            const nodesToDelete = nodes.filter((n) => selectedNodeIds.includes(n.id));
            const edgesToDelete = edges.filter((e) =>
              selectedNodeIds.includes(e.source) || selectedNodeIds.includes(e.target)
            );

            // Delete from ReactFlow
            deleteElements({ nodes: nodesToDelete, edges: edgesToDelete });
          }
          break;
        case 'escape':
          if (isExportModalOpen) {
            setExportModalOpen(false);
          } else {
            deselectAll();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    deleteElements,
    selectedNodeIds,
    nodes,
    edges,
    setCurrentTool,
    setExportModalOpen,
    isExportModalOpen,
    undo,
    saveJSON,
    deselectAll
  ]);
};
