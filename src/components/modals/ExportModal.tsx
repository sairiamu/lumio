import React, { useState } from 'react';
import { X, Download, FileJson, Image, FileCode, Upload } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useExport } from '../../hooks/useExport';

export interface ExportModalProps {}

const ExportModalInner: React.FC = () => {
  const { setExportModalOpen } = useCanvasStore();
  const [activeTab, setActiveTab] = useState<'svg' | 'png' | 'json'>('svg');
  const { exportAsSVG, handlePNGExport, exportAsJSON, importProject } = useExport();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-panel w-[500px] rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-xl font-sora font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-iris" />
            Export Project
          </h2>
          <button
            onClick={() => setExportModalOpen(false)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 gap-1 bg-white/5 border-b border-white/10">
          <button
            onClick={() => setActiveTab('svg')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'svg' ? 'bg-iris text-white shadow-lg' : 'hover:bg-white/5 text-fog'
            }`}
          >
            <FileCode className="w-4 h-4" />
            SVG
          </button>
          <button
            onClick={() => setActiveTab('png')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'png' ? 'bg-iris text-white shadow-lg' : 'hover:bg-white/5 text-fog'
            }`}
          >
            <Image className="w-4 h-4" />
            PNG
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'json' ? 'bg-iris text-white shadow-lg' : 'hover:bg-white/5 text-fog'
            }`}
          >
            <FileJson className="w-4 h-4" />
            JSON
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col gap-6">
          <div className="text-center">
            {activeTab === 'svg' && (
              <div className="space-y-4">
                <p className="text-fog text-sm">
                  High-quality vector export. Perfect for printing or editing in Figma/Illustrator.
                </p>
                <button
                  onClick={exportAsSVG}
                  className="w-full bg-iris hover:bg-iris/90 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
                >
                  Export SVG
                </button>
              </div>
            )}
            {activeTab === 'png' && (
              <div className="space-y-4">
                <p className="text-fog text-sm">
                  Standard raster image at 2x resolution for sharpness.
                  Ideal for sharing or embedding in documents.
                </p>
                <button
                  onClick={handlePNGExport}
                  className="w-full bg-iris hover:bg-iris/90 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
                >
                  Export PNG
                </button>
              </div>
            )}
            {activeTab === 'json' && (
              <div className="space-y-4">
                <p className="text-fog text-sm">
                  Save your full project including nodes, edges, and freehand strokes.
                  Use this to backup or move your work.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={exportAsJSON}
                    className="flex-1 bg-iris hover:bg-iris/90 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
                  >
                    Save File
                  </button>
                  <button
                    onClick={importProject}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Load File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/5 px-6 py-4 text-[10px] text-fog/50 text-center uppercase tracking-widest border-t border-white/5">
          VibePlan Export Engine v1.0
        </div>
      </div>
    </div>
  );
};

export const ExportModal: React.FC<ExportModalProps> = () => {
  const { isExportModalOpen } = useCanvasStore();

  if (!isExportModalOpen) return null;

  return <ExportModalInner />;
};
