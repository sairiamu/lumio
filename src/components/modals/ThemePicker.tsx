import React from 'react';
import { X, Sun, Moon } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { themes, Theme, ThemeName } from '../../themes/themes';

const ThemeOption: React.FC<{ theme: Theme; isSelected: boolean; onSelect: (id: ThemeName) => void }> = ({
  theme,
  isSelected,
  onSelect
}) => {
  const Icon = theme.id === 'light' ? Sun : Moon;

  return (
    <button
      onClick={() => onSelect(theme.id)}
      className={`
        flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-200 group
        border-2
        ${isSelected
          ? 'bg-white/5 border-accent shadow-lg shadow-accent/10'
          : 'bg-black/20 border-transparent hover:bg-white/5 hover:border-white/10'}
      `}
    >
      <div
        className={`p-4 rounded-full transition-colors ${isSelected ? 'bg-accent text-white' : 'bg-white/5 text-text-muted group-hover:text-text'}`}
      >
        <Icon className="w-8 h-8" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className={`font-sora font-bold text-sm ${isSelected ? 'text-text' : 'text-text-muted'}`}>
          {theme.name.toUpperCase()}
        </span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.colors.clay1 }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.colors.clay2 }} />
        </div>
      </div>
    </button>
  );
};

export const ThemePicker: React.FC = () => {
  const { isThemePickerOpen, setThemePickerOpen, currentTheme, setTheme } = useCanvasStore();

  if (!isThemePickerOpen) return null;

  const darkTheme = themes.find(t => t.id === 'dark')!;
  const lightTheme = themes.find(t => t.id === 'light')!;

  return (
    <div className="fixed top-12 right-16 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="glass-panel w-[380px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/5 bg-white/5">
          <h3 className="font-sora font-bold text-sm tracking-widest text-text">APPEARANCE</h3>
          <button
            onClick={() => setThemePickerOpen(false)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-text-muted hover:text-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex gap-4">
          <ThemeOption
            theme={lightTheme}
            isSelected={currentTheme === 'light'}
            onSelect={setTheme}
          />
          <ThemeOption
            theme={darkTheme}
            isSelected={currentTheme === 'dark'}
            onSelect={setTheme}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex items-center justify-center">
          <span className="text-[11px] text-text-muted uppercase tracking-widest font-medium">
            System Preference Integrated
          </span>
        </div>
      </div>
    </div>
  );
};
