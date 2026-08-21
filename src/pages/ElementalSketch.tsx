import React, { useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ToolBar } from '../components/toolbar/ToolBar';
import { CanvasWrapper } from '../components/canvas/CanvasWrapper';
import { PropertiesPanel } from '../components/panels/PropertiesPanel';
import { PenToolbar } from '../components/toolbar/PenToolbar';
import { TemplateModal } from '../components/modals/TemplateModal';
import { PresentationSetupModal } from '../components/modals/PresentationSetupModal';
import { useCanvasStore } from '../store/canvasStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const ElementalSketch: React.FC = () => {
  const {
    isPanelOpen,
    togglePanelOpen,
    isPresentationMode,
    setHelpModalOpen
  } = useCanvasStore();

  useKeyboardShortcuts();

  useEffect(() => {
    const helpSeen = localStorage.getItem('lumio-help-seen');
    if (helpSeen !== 'true') {
      setHelpModalOpen(true);
    }
  }, [setHelpModalOpen]);

  return (
    <>
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
        </main>

        <div
          className={`transition-all duration-200 ease-in-out shrink-0 overflow-hidden h-full ${!isPresentationMode && isPanelOpen ? 'w-[256px] translate-x-0 pointer-events-auto' : 'w-0 translate-x-full pointer-events-none'}`}
        >
          <PropertiesPanel />
        </div>
      </div>

      <TemplateModal />
      <PresentationSetupModal />
      {!isPresentationMode && <PenToolbar />}

      {/* Visual Debug Indicator */}
      {!isPresentationMode && (
        <div className="absolute top-12 left-20 bg-accent px-2 py-1 rounded text-white text-[10px] z-100 shadow-lg pointer-events-none">
          Lumio
        </div>
      )}
    </>
  );
};
