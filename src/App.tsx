import React, { useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { TitleBar } from './components/shell/TitleBar';
import { ToolBar } from './components/toolbar/ToolBar';
import { PenToolbar } from './components/toolbar/PenToolbar';
import { CanvasWrapper } from './components/canvas/CanvasWrapper';
import { PropertiesPanel } from './components/panels/PropertiesPanel';
import { StatusBar } from './components/shell/StatusBar';
import { ThemePicker } from './components/modals/ThemePicker';
import { TemplateModal } from './components/modals/TemplateModal';
import { CommandPalette } from './components/modals/CommandPalette';
import { ToastContainer } from './components/ui/Toast';
import { useCanvasStore } from './store/canvasStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './hooks/useTheme';
import { ensureProjectsDir } from './utils/projectDir';

const App: React.FC = () => {
  const {
    isPanelOpen,
    togglePanelOpen,
    isPresentationMode,
    togglePresentationMode
  } = useCanvasStore();

  useTheme();
  useKeyboardShortcuts();

  useEffect(() => {
    ensureProjectsDir().catch(console.error);
  }, []);

  useEffect(() => {
    const handleFullscreen = async () => {
      try {
        await getCurrentWindow().setFullscreen(isPresentationMode);
      } catch (err) {
        console.error('Failed to set fullscreen:', err);
      }
    };
    handleFullscreen();
  }, [isPresentationMode]);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      {!isPresentationMode && <TitleBar />}

      <div className="flex flex-1 relative overflow-hidden">
        {!isPresentationMode && <ToolBar />}

        <main className="flex-1 relative overflow-hidden" style={{ backgroundColor: 'var(--canvas)' }}>
          <CanvasWrapper />

          {!isPresentationMode && (
            <button
              type="button"
              onClick={togglePanelOpen}
              className={`absolute top-4 right-4 z-40 rounded-full p-2 transition-all duration-200 shadow-lg ${isPanelOpen ? 'bg-accent text-white' : 'glass-panel text-text hover:bg-white/10'}`}
              aria-label="Properties Panel"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}

          {isPresentationMode && (
            <button
              type="button"
              onClick={togglePresentationMode}
              className="absolute bottom-6 right-6 z-50 p-3 rounded-full glass-panel text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-xl"
              title="Exit Presentation Mode"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </main>

        <div
          className={`transition-all duration-200 ease-in-out shrink-0 overflow-hidden h-full ${!isPresentationMode && isPanelOpen ? 'w-[256px] translate-x-0 pointer-events-auto' : 'w-0 translate-x-full pointer-events-none'}`}
        >
          <PropertiesPanel />
        </div>
      </div>

      {!isPresentationMode && <StatusBar />}
      <ThemePicker />
      <TemplateModal />
      <CommandPalette />
      {!isPresentationMode && <PenToolbar />}
      <ToastContainer />

      {/* Visual Debug Indicator */}
      {!isPresentationMode && (
        <div className="absolute top-12 left-20 bg-accent px-2 py-1 rounded text-white text-[10px] z-100 shadow-lg pointer-events-none">
          VibePlan
        </div>
      )}
    </div>
  );
};

export default App;
