import React, { useState, useRef, useEffect } from 'react';
import {
  Minus, Square, X, Hexagon, Palette, FileText, FolderOpen,
  Save, Clock, ChevronDown, Share2, Layout, Monitor, Search, Grid3X3, HelpCircle,
  Maximize2, Minimize2
} from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useCanvasStore } from '../../store/canvasStore';
import { useFileIO } from '../../hooks/useFileIO';

// Call once outside component to get stable reference
const appWindow = getCurrentWindow();

export const TitleBar: React.FC = () => {
  const {
    projectName,
    isDirty,
    setThemePickerOpen,
    isThemePickerOpen,
    isShareModalOpen,
    setShareModalOpen,
    isHelpModalOpen,
    setHelpModalOpen,
    recentProjects,
    setTemplateModalOpen,
    togglePresentationMode,
    toggleCommandPalette,
    toggleGrid,
    isGridEnabled
  } = useCanvasStore();
  const { saveProject, loadProject } = useFileIO();
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const fileMenuRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    appWindow.isMaximized().then(setIsMaximized);
    const unlisten = appWindow.onResized(() => {
      appWindow.isMaximized().then(setIsMaximized);
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target as Node)) {
        setIsFileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMinimize = async () => {
    try {
      await appWindow.minimize();
    } catch (e) {
      console.error('Minimize failed:', e);
    }
  };

  const handleMaximize = async () => {
    try {
      await appWindow.toggleMaximize();
    } catch (e) {
      console.error('Maximize failed:', e);
    }
  };

  const handleClose = async () => {
    try {
      const dirty = useCanvasStore.getState().isDirty;
      if (dirty) {
        const { confirm } = await import('@tauri-apps/plugin-dialog');
        const ok = await confirm(
          'You have unsaved changes. Close without saving?',
          { title: 'Unsaved Changes', kind: 'warning' }
        );
        if (!ok) return;
      }
      await appWindow.close();
    } catch (e) {
      console.error('Close failed:', e);
    }
  };

  return (
    <div className="h-10 glass-panel border-none rounded-none flex items-center justify-between select-none z-50 shrink-0 overflow-hidden">
      {/* Drag Region */}
      <div
        data-tauri-drag-region
        className="flex-grow flex items-center px-4 h-full"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pointer-events-none">
            <img
              src="/vibeplan.svg"
              alt="VibePlan"
              style={{ width: 20, height: 20 }}
            />
            <span className="font-sora font-bold text-sm tracking-tight text-text">VibePlan</span>
          </div>

          <div className="relative pointer-events-auto" ref={fileMenuRef}>
            <button
              onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors text-xs font-medium ${isFileMenuOpen ? 'bg-white/10 text-accent' : 'text-text-muted hover:bg-white/5'}`}
            >
              File
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isFileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFileMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 glass-panel border-white/10 shadow-2xl rounded-lg overflow-hidden py-1 z-[60] animate-in fade-in slide-in-from-top-1 duration-200">
                <button
                  onClick={() => {
                    loadProject();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs text-text hover:bg-white/10 transition-colors"
                >
                  <FolderOpen className="w-4 h-4 text-accent" />
                  Open Project
                </button>
                <button
                  onClick={() => {
                    setTemplateModalOpen(true);
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs text-text hover:bg-white/10 transition-colors"
                >
                  <Layout className="w-4 h-4 text-accent" />
                  Templates
                </button>
                <button
                  onClick={() => {
                    saveProject(projectName);
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs text-text hover:bg-white/10 transition-colors"
                >
                  <Save className="w-4 h-4 text-accent" />
                  Save Project
                </button>

                {recentProjects.length > 0 && (
                  <>
                    <div className="h-px bg-white/5 my-1" />
                    <div className="px-4 py-1.5 flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      Recent Projects
                    </div>
                    {recentProjects.map((path) => (
                      <button
                        key={path}
                        onClick={() => {
                          loadProject(path);
                          setIsFileMenuOpen(false);
                        }}
                        className="w-full flex flex-col items-start px-4 py-2 text-xs text-text hover:bg-white/10 transition-colors group"
                      >
                        <span className="truncate w-full font-medium group-hover:text-accent">
                          {path.split(/[\\/]/).pop()?.replace('.vibeplan.json', '')}
                        </span>
                        <span className="text-[10px] text-text-muted truncate w-full">
                          {path}
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          <button
            onClick={toggleCommandPalette}
            className="pointer-events-auto flex items-center gap-1.5 px-2 py-1 rounded-md text-text-muted hover:bg-white/5 hover:text-text transition-colors text-xs font-medium"
            title="Command Palette (Ctrl+P)"
          >
            <Search className="w-3.5 h-3.5 text-accent" />
            Commands
          </button>

          <button
            onClick={toggleGrid}
            className={`pointer-events-auto flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-xs font-medium ${isGridEnabled ? 'text-accent hover:bg-white/10' : 'text-text-muted hover:bg-white/5'}`}
            title="Toggle Grid (G)"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            Grid
          </button>

          <div className="flex items-center gap-1.5 pointer-events-none">
            <span className="text-text-muted/30 font-light mx-1">—</span>
            <span className="font-inter font-medium text-xs text-text-muted">
              {projectName}
            </span>
            {isDirty && (
              <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
            )}
          </div>
        </div>
      </div>

      {/* Control Buttons - NO drag region here */}
      <div className="flex items-center h-full">
        <button
          onClick={togglePresentationMode}
          className="p-2 hover:bg-white/10 transition-colors rounded-lg text-text-muted hover:text-accent mr-1"
          title="Presentation Mode (F11)"
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button
          onClick={() => setHelpModalOpen(!isHelpModalOpen)}
          className={`p-2 hover:bg-white/10 transition-colors rounded-lg ${isHelpModalOpen ? 'text-accent' : 'text-text-muted'} mr-1`}
          title="Help (F1)"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShareModalOpen(!isShareModalOpen)}
          className={`p-2 hover:bg-white/10 transition-colors rounded-lg ${isShareModalOpen ? 'text-accent' : 'text-text-muted'} mr-1`}
          aria-label="Share Project"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setThemePickerOpen(!isThemePickerOpen)}
          className={`p-2 hover:bg-white/10 transition-colors rounded-lg ${isThemePickerOpen ? 'text-accent' : 'text-text-muted'} mr-2`}
          aria-label="Theme Picker"
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* Window Controls */}
        <button
          onClick={handleMinimize}
          className="w-10 h-8 flex items-center justify-center transition-colors duration-150 hover:bg-yellow-500/20 text-text-muted"
          aria-label="Minimize"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-10 h-8 flex items-center justify-center transition-colors duration-150 hover:bg-green-500/20 text-text-muted"
          aria-label={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        <button
          onClick={handleClose}
          className="w-10 h-8 flex items-center justify-center transition-colors duration-150 hover:bg-red-500/30 text-text-muted hover:text-red-400"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
