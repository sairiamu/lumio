import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useCanvasStore } from '../store/canvasStore';

export const useKeyboardShortcuts = () => {
  const { deleteElements, zoomIn, zoomOut, setViewport } = useReactFlow();
    const {
    selectedNodeIds,
    selectedEdgeIds,
    nodes,
    edges,
    setCurrentTool,
    setExportModalOpen,
    isExportModalOpen,
    undo,
    saveJSON,
    deselectAll,
    deleteSelectedNodes
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
          case '=':
          case '+':
            e.preventDefault();
            zoomIn({ duration: 200 });
            break;
          case '-':
            e.preventDefault();
            zoomOut({ duration: 200 });
            break;
          case '0':
            e.preventDefault();
            setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 200 });
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
          if (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0) {
            const nodesToDelete = nodes.filter((n) => selectedNodeIds.includes(n.id));
            const edgesToDelete = edges.filter((e) =>
              selectedEdgeIds.includes(e.id) ||
              selectedNodeIds.includes(e.source) ||
              selectedNodeIds.includes(e.target)
            );

            // Delete from ReactFlow
            deleteElements({ nodes: nodesToDelete, edges: edgesToDelete });
            // Remove from our zustand store and clear selection
            deleteSelectedNodes();
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
    selectedEdgeIds,
    nodes,
    edges,
    setCurrentTool,
    setExportModalOpen,
    isExportModalOpen,
    undo,
    saveJSON,
    deselectAll,
    zoomIn,
    zoomOut,
    setViewport
  ]);
};
