import React, { useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { TitleBar } from '../components/shell/TitleBar';
import { StatusBar } from '../components/shell/StatusBar';
import { UpdateBanner } from '../components/shell/UpdateBanner';
import { ThemePicker } from '../components/modals/ThemePicker';
import { HelpModal } from '../components/modals/HelpModal';
import { CommandPalette } from '../components/modals/CommandPalette';
import { ToastContainer } from '../components/ui/Toast';
import { useCanvasStore } from '../store/canvasStore';
import { useTheme } from '../hooks/useTheme';
import { useUpdater } from '../hooks/useUpdater';
import { ensureProjectsDir, checkOldProjectMigration } from '../utils/projectDir';

interface ProjectShellProps {
  children: React.ReactNode;
}

export const ProjectShell: React.FC<ProjectShellProps> = ({ children }) => {
  const {
    isPresentationMode,
    setIsAppReady,
    addToast
  } = useCanvasStore();

  const updater = useUpdater();
  useTheme();

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

      // 2. Signal app is ready
      setIsAppReady(true);

      // 3. Show window
      try {
        const win = getCurrentWindow();
        await win.show();
      } catch (error) {
        console.error('Failed to show window:', error);
      }
    };

    initApp();
  }, [setIsAppReady, addToast]);

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

      {children}

      {!isPresentationMode && <StatusBar />}

      <ThemePicker />
      <HelpModal />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};
