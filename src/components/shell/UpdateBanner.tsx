import React from 'react';
import { X } from 'lucide-react';

interface UpdateBannerProps {
  updateAvailable: boolean;
  updateInfo: { version: string; notes: string } | null;
  isDownloading: boolean;
  downloadProgress: number;
  installUpdate: () => Promise<void>;
  onDismiss: () => void;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({
  updateAvailable,
  updateInfo,
  isDownloading,
  downloadProgress,
  installUpdate,
  onDismiss
}) => {
  if (!updateAvailable || !updateInfo) return null;

  return (
    <div className="relative w-full h-9 bg-linear-to-r from-[var(--accent)] to-[var(--success)] opacity-90 text-white flex items-center justify-between px-4 z-50 shrink-0">
      {/* Progress bar background */}
      {isDownloading && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300"
          style={{ width: `${downloadProgress}%` }}
        />
      )}

      <div className="flex items-center gap-2 truncate flex-1 mr-4">
        <span className="text-[12px] font-medium font-sans">
          ✦ VibePlan {updateInfo.version} is available — {updateInfo.notes.split('\n')[0]}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={installUpdate}
          disabled={isDownloading}
          className="bg-white text-[var(--accent)] px-3 py-1 rounded-lg text-[12px] font-semibold hover:bg-opacity-90 transition-colors whitespace-nowrap"
        >
          {isDownloading ? `Downloading... ${downloadProgress}%` : 'Update Now'}
        </button>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
