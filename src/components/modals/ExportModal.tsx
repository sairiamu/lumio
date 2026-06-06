import React, { useState } from 'react';
import { X, Download, FileJson, Image, FileCode, Upload, FileText, ClipboardCopy } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useExport } from '../../hooks/useExport';

export interface ExportModalProps {}

const ExportModalInner: React.FC = () => {
  const { setExportModalOpen } = useCanvasStore();
  const [activeTab, setActiveTab] = useState<'svg' | 'png' | 'pdf' | 'json'>('svg');
  const { exportAsSVG, handlePNGExport, handlePDFExport, handleCopyToClipboard, exportAsJSON, importProject } = useExport();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-panel w-[500px] rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-border">
          <h2 className="text-xl font-sora font-bold flex items-center gap-2 text-text">
            <Download className="w-5 h-5 text-accent" />
            Export Project
          </h2>
          <button
            onClick={() => setExportModalOpen(false)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-text"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 gap-1 bg-white/5 border-b border-border">
          <button
            onClick={() => setActiveTab('svg')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'svg' ? 'bg-accent text-white shadow-lg' : 'hover:bg-white/5 text-text-muted'
            }`}
          >
            <FileCode className="w-4 h-4" />
            SVG
          </button>
          <button
            onClick={() => setActiveTab('png')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'png' ? 'bg-accent text-white shadow-lg' : 'hover:bg-white/5 text-text-muted'
            }`}
          >
            <Image className="w-4 h-4" />
            PNG
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'pdf' ? 'bg-accent text-white shadow-lg' : 'hover:bg-white/5 text-text-muted'
            }`}
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'json' ? 'bg-accent text-white shadow-lg' : 'hover:bg-white/5 text-text-muted'
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
                <p className="text-text-muted text-sm">
                  High-quality vector export. Perfect for printing or editing in Figma/Illustrator.
                </p>
                <button
                  onClick={exportAsSVG}
                  className="w-full bg-accent hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
                >
                  Export SVG
                </button>
              </div>
            )}
            {activeTab === 'png' && (
              <div className="space-y-4">
                <p className="text-text-muted text-sm">
                  Standard raster image at 2x resolution for sharpness.
                  Ideal for sharing or embedding in documents.
                </p>
                <button
                  onClick={handlePNGExport}
                  className="w-full bg-accent hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
                >
                  Export PNG
                </button>
              </div>
            )}
            {activeTab === 'pdf' && (
              <div className="space-y-4">
                <p className="text-text-muted text-sm">
                  Document format. Great for sharing a fixed layout or printing.
                </p>
                <button
                  onClick={handlePDFExport}
                  className="w-full bg-accent hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
                >
                  Export PDF
                </button>
              </div>
            )}
            {activeTab === 'json' && (
              <div className="space-y-4">
                <p className="text-text-muted text-sm">
                  Save your full project including nodes, edges, and freehand strokes.
                  Use this to backup or move your work.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={exportAsJSON}
                    className="flex-1 bg-accent hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
                  >
                    Save File
                  </button>
                  <button
                    onClick={importProject}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-text font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Load File
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/5">
            <button
              onClick={handleCopyToClipboard}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-text font-medium transition-all active:scale-[0.98] cursor-pointer"
            >
              <ClipboardCopy className="w-4 h-4" />
              Copy to Clipboard
              <span className="text-[10px] opacity-40 ml-1">Ctrl+Shift+C</span>
            </button>
          </div>
        </div>

        <div className="bg-white/5 px-6 py-4 text-[10px] text-text-muted/50 text-center uppercase tracking-widest border-t border-border">
          Lumio Export Engine v1.5
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
