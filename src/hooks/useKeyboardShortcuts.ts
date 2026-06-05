import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useCanvasStore } from '../store/canvasStore';
import { useFileIO } from './useFileIO';
import { useExport } from './useExport';

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
    redo,
    copy,
    paste,
    cut,
    duplicate,
    selectAll,
    deselectAll,
    deleteSelectedNodes,
    setIsPanelOpen,
    isShapeLibraryOpen,
    setIsShapeLibraryOpen,
    setTrackedNodeId,
    projectName,
    isPresentationMode,
    togglePresentationMode,
    nextStep,
    prevStep,
    groupSelectedNodes,
    ungroupSelectedNodes,
    setIsSearchOpen,
    isSearchOpen,
    setSearchQuery
  } = useCanvasStore();

  const { saveProject } = useFileIO();
  const { handleCopyToClipboard: copyCanvas } = useExport();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        if (e.key === 'Escape' && isSearchOpen) {
          setIsSearchOpen(false);
          setSearchQuery('');
        }
        return;
      }

      // Meta/Ctrl shortcuts
      if (e.ctrlKey || e.metaKey) {
        // Handle Ctrl+Shift+Z separately
        if (e.shiftKey && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          redo();
          return;
        }

        // Handle Ctrl+Shift+G for ungroup
        if (e.shiftKey && e.key.toLowerCase() === 'g') {
          e.preventDefault();
          ungroupSelectedNodes();
          return;
        }

        // Handle Ctrl+Shift+C for copy canvas image
        if (e.shiftKey && e.key.toLowerCase() === 'c') {
          e.preventDefault();
          copyCanvas();
          return;
        }

        switch (e.key.toLowerCase()) {
          case 'f':
            e.preventDefault();
            setIsSearchOpen(true);
            break;
          case 'g':
            e.preventDefault();
            groupSelectedNodes();
            break;
          case 'e':
            e.preventDefault();
            setExportModalOpen(true);
            break;
          case 'z':
            e.preventDefault();
            undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'c':
            e.preventDefault();
            copy();
            break;
          case 'v':
            e.preventDefault();
            paste();
            break;
          case 'x':
            e.preventDefault();
            cut();
            break;
          case 'a':
            e.preventDefault();
            selectAll();
            break;
          case 'd':
            e.preventDefault();
            duplicate();
            break;
          case 's':
            e.preventDefault();
            saveProject(projectName);
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
        case 'f11':
          e.preventDefault();
          togglePresentationMode();
          break;
        case 'arrowright':
        case ' ':
          if (isPresentationMode) {
            e.preventDefault();
            nextStep();
          }
          break;
        case 'arrowleft':
          if (isPresentationMode) {
            e.preventDefault();
            prevStep();
          }
          break;
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
        case 'p':
          setCurrentTool('draw');
          break;
        case 'e':
          setCurrentTool('eraser');
          break;
        case 'l':
          setIsShapeLibraryOpen(!isShapeLibraryOpen);
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
          } else if (isPresentationMode) {
            togglePresentationMode();
          } else {
            deselectAll();
            setIsPanelOpen(false);
            setTrackedNodeId(null);
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
    redo,
    copy,
    paste,
    cut,
    duplicate,
    selectAll,
    deselectAll,
    setIsPanelOpen,
    isShapeLibraryOpen,
    setIsShapeLibraryOpen,
    zoomIn,
    zoomOut,
    setViewport,
    deleteSelectedNodes,
    setTrackedNodeId,
    saveProject,
    projectName,
    isPresentationMode,
    togglePresentationMode,
    nextStep,
    prevStep,
    groupSelectedNodes,
    ungroupSelectedNodes,
    setIsSearchOpen,
    isSearchOpen,
    setSearchQuery
  ]);
};
