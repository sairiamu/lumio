import React, { useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { TitleBar } from './components/shell/TitleBar';
import { ToolBar } from './components/toolbar/ToolBar';
import { PenToolbar } from './components/toolbar/PenToolbar';
import { CanvasWrapper } from './components/canvas/CanvasWrapper';
import { PropertiesPanel } from './components/panels/PropertiesPanel';
import { StatusBar } from './components/shell/StatusBar';
import { ThemePicker } from './components/modals/ThemePicker';
import { TemplateModal } from './components/modals/TemplateModal';
import { useCanvasStore } from './store/canvasStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './hooks/useTheme';
import { ensureProjectsDir } from './utils/projectDir';

const App: React.FC = () => {
  const {
    isPanelOpen,
    togglePanelOpen
  } = useCanvasStore();

  useTheme();
  useKeyboardShortcuts();

  useEffect(() => {
    ensureProjectsDir().catch(console.error);
  }, []);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <TitleBar />

      <div className="flex flex-1 relative overflow-hidden">
        <ToolBar />

        <main className="flex-1 relative overflow-hidden" style={{ backgroundColor: 'var(--canvas)' }}>
          <CanvasWrapper />

          <button
            type="button"
            onClick={togglePanelOpen}
            className={`absolute top-4 right-4 z-40 rounded-full p-2 transition-all duration-200 shadow-lg ${isPanelOpen ? 'bg-accent text-white' : 'glass-panel text-text hover:bg-white/10'}`}
            aria-label="Properties Panel"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </main>

        <div
          className={`transition-all duration-200 ease-in-out shrink-0 overflow-hidden h-full ${isPanelOpen ? 'w-[256px] translate-x-0 pointer-events-auto' : 'w-0 translate-x-full pointer-events-none'}`}
        >
          <PropertiesPanel />
        </div>
      </div>

      <StatusBar />
      <ThemePicker />
      <TemplateModal />
      <PenToolbar />

      {/* Visual Debug Indicator */}
      <div className="absolute top-12 left-20 bg-accent px-2 py-1 rounded text-white text-[10px] z-100 shadow-lg pointer-events-none">
        VibePlan
      </div>
    </div>
  );
};

export default App;
