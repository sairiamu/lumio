import React, { useEffect, useRef, useState } from 'react';
import { X, Share2, Copy, Check, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { useCanvasStore } from '../../store/canvasStore';
import { buildShareURL } from '../../utils/shareUtils';

const ShareModalInner: React.FC = () => {
  const { setShareModalOpen } = useCanvasStore();
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shareURL = buildShareURL();

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, shareURL, {
        width: 200,
        margin: 2,
        color: {
          dark: '#E2E8F0', // text-muted color or light gray
          light: '#1C1E26' // background color
        }
      }, (error) => {
        if (error) console.error('QR Code generation failed:', error);
      });
    }
  }, [shareURL]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'lumio-qr.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-panel w-[450px] rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-border">
          <h2 className="text-xl font-sora font-bold flex items-center gap-2 text-text">
            <Share2 className="w-5 h-5 text-accent" />
            Share Project
          </h2>
          <button
            onClick={() => setShareModalOpen(false)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-text"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center gap-6">
          <div className="w-full space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareURL}
                className="flex-1 bg-white/5 border border-border rounded-lg px-4 py-2 text-sm text-text outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all transform active:scale-[0.98] cursor-pointer min-w-[100px] justify-center ${
                  copied ? 'bg-success/20 text-success border border-success/30' : 'bg-accent text-white hover:opacity-90'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#1C1E26] p-4 rounded-lg border border-border shadow-inner">
              <canvas ref={canvasRef} className="rounded-sm" />
            </div>
          </div>

          <button
            onClick={downloadQR}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-text font-bold py-3 rounded-xl transition-all border border-border transform active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4 text-accent" />
            Download QR Code
          </button>
        </div>

        <div className="bg-white/5 px-6 py-4 text-[10px] text-text-muted/50 text-center uppercase tracking-widest border-t border-border">
          Shared links are read-only snapshots
        </div>
      </div>
    </div>
  );
};

export const ShareModal: React.FC = () => {
  const { isShareModalOpen } = useCanvasStore();

  if (!isShareModalOpen) return null;

  return <ShareModalInner />;
};
