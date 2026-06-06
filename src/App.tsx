import React, { useEffect, useState } from 'react';
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
import { SplashScreen } from './components/shell/SplashScreen';
import HelpModal from './components/modals/HelpModal';
import { ToastContainer } from './components/ui/Toast';
import { UpdateBanner } from './components/shell/UpdateBanner';
import { useCanvasStore } from './store/canvasStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './hooks/useTheme';
import { useUpdater } from './hooks/useUpdater';
import { ensureProjectsDir, checkOldProjectMigration } from './utils/projectDir';

// Prevents splash from showing on hot reloads
let hasShownSplash = false;

const App: React.FC = () => {
  const {
    isPanelOpen,
    togglePanelOpen,
    isPresentationMode,
    togglePresentationMode,
    setIsAppReady,
    setHelpModalOpen,
    addToast
  } = useCanvasStore();

  const [showSplash, setShowSplash] = useState(!hasShownSplash);
  const updater = useUpdater();

  useTheme();
  useKeyboardShortcuts();

  useEffect(() => {
    const initApp = async () => {
      // 1. Ensure projects directory
      try {
        await ensureProjectsDir();
        const hasCheckedMigration = localStorage.getItem('lumio-migration-checked');
        if (!hasCheckedMigration) {
          if (await checkOldProjectMigration()) {
            addToast("Your projects folder has moved to ~/Lumio", "info");
          }
          localStorage.setItem('lumio-migration-checked', 'true');
        }
      } catch (error) {
        console.error('Failed to initialize projects directory:', error);
      }

      // 2. Signal app is ready (setup complete)
      setIsAppReady(true);
      hasShownSplash = true;

      // 3. Show window (prevent white flash)
      try {
        const win = getCurrentWindow();
        await win.show();
      } catch (error) {
        console.error('Failed to show window:', error);
      }
    };

    initApp();
  }, [setIsAppReady]);

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

  useEffect(() => {
    if (!showSplash) {
      const helpSeen = localStorage.getItem('lumio-help-seen');
      if (helpSeen !== 'true') {
        setHelpModalOpen(true);
      }
    }
  }, [showSplash, setHelpModalOpen]);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      {!isPresentationMode && <TitleBar />}
      {!isPresentationMode && updater.updateAvailable && !updater.isDismissed && (
        <UpdateBanner
          updateAvailable={updater.updateAvailable}
          updateInfo={updater.updateInfo}
          isDownloading={updater.isDownloading}
          downloadProgress={updater.downloadProgress}
          installUpdate={updater.installUpdate}
          onDismiss={() => updater.setIsDismissed(true)}
        />
      )}

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
      <HelpModal />
      <TemplateModal />
      <CommandPalette />
      {!isPresentationMode && <PenToolbar />}
      <ToastContainer />

      {/* Visual Debug Indicator */}
      {!isPresentationMode && (
        <div className="absolute top-12 left-20 bg-accent px-2 py-1 rounded text-white text-[10px] z-100 shadow-lg pointer-events-none">
          Lumio
        </div>
      )}

      {showSplash && <SplashScreen onAnimationEnd={() => setShowSplash(false)} />}
    </div>
  );
};

export default App;
