import React from 'react';
import { Palette, X } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { themes, ThemeName } from '../../themes/themes';

export const ThemePicker: React.FC = () => {
  const { isThemePickerOpen, setThemePickerOpen, currentTheme, setTheme } = useCanvasStore();

  if (!isThemePickerOpen) return null;

  return (
    <div className="fixed top-12 right-16 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="glass-panel w-[420px] rounded-xl shadow-2xl overflow-hidden border border-border">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-accent" />
            <h3 className="font-sora font-semibold text-xs uppercase tracking-wider text-text">Select Theme</h3>
          </div>
          <button
            onClick={() => setThemePickerOpen(false)}
            className="p-1 hover:bg-white/10 rounded-md transition-colors text-text-muted hover:text-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 gap-2">
          {(Object.entries(themes) as [ThemeName, typeof themes['slate']][]).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`
                flex items-center justify-between p-3 rounded-lg transition-all border
                ${currentTheme === key
                  ? 'border-accent bg-accent/10 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                  : 'border-border hover:bg-white/5 hover:border-text-muted/30'}
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md shadow-inner border border-white/10 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: theme.background }}
                >
                    <div className="flex gap-0.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.success }} />
                    </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-text">{theme.name}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-tight">{key}</div>
                </div>
              </div>

              {currentTheme === key && (
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
