import React, { useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { TitleBar } from './components/shell/TitleBar';
import { ToolBar } from './components/toolbar/ToolBar';
import { CanvasWrapper } from './components/canvas/CanvasWrapper';
import { PropertiesPanel } from './components/panels/PropertiesPanel';
import { StatusBar } from './components/shell/StatusBar';
import { useCanvasStore } from './store/canvasStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const App: React.FC = () => {
  const {
    setExportModalOpen,
    isExportModalOpen,
    setCurrentTool,
    deleteSelectedNodes,
    undo,
    saveJSON,
    deselectAll,
    isPanelOpen,
    togglePanelOpen
  } = useCanvasStore();

  useKeyboardShortcuts();

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
          deleteSelectedNodes();
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
    setExportModalOpen,
    isExportModalOpen,
    setCurrentTool,
    deleteSelectedNodes,
    undo,
    saveJSON,
    deselectAll
  ]);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--void)', color: 'var(--cloud)' }}
    >
      <TitleBar />

      <div className="flex flex-1 relative overflow-hidden">
        <ToolBar />

        <main className="flex-1 relative overflow-hidden" style={{ backgroundColor: 'var(--ash)' }}>
          <CanvasWrapper />

          <button
            type="button"
            onClick={togglePanelOpen}
            className={`absolute top-4 right-4 z-40 rounded-full p-2 transition-all duration-200 shadow-lg ${isPanelOpen ? 'bg-iris text-white' : 'glass-panel text-cloud hover:bg-white/10'}`}
            aria-label="Properties Panel"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </main>

        <div
          className={`transition-all duration-200 ease-in-out shrink-0 overflow-hidden ${isPanelOpen ? 'w-[256px] translate-x-0 pointer-events-auto' : 'w-0 translate-x-full pointer-events-none'}`}
        >
          <PropertiesPanel />
        </div>
      </div>

      <StatusBar />

      {/* Visual Debug Indicator */}
      <div className="absolute top-12 left-20 bg-indigo-600 px-2 py-1 rounded text-white text-[10px] z-100 shadow-lg pointer-events-none" style={{ backgroundColor: 'var(--iris)' }}>
        VibePlan
      </div>
    </div>
  );
};

export default App;
