import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { themes, Theme, ThemeName } from '../../themes/themes';

const ThemeCard: React.FC<{ theme: Theme; isSelected: boolean; onSelect: (id: ThemeName) => void }> = ({
  theme,
  isSelected,
  onSelect
}) => {
  return (
    <div
      onClick={() => onSelect(theme.id)}
      className={`
        relative w-[130px] h-[90px] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group
        border-2
        ${isSelected
          ? 'border-[var(--card-accent)] shadow-[0_0_0_3px_rgba(var(--card-accent-rgb),0.2)]'
          : 'border-transparent hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25'}
      `}
      style={{
        ['--card-accent' as any]: theme.colors.accent,
        ['--card-accent-rgb' as any]: hexToRgb(theme.colors.accent)
      }}
    >
      {/* Mini Canvas Preview (58%) */}
      <div
        className="h-[58%] w-full relative overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: theme.colors.canvasBg }}
      >
        <div className="relative w-16 h-10">
          <div className="absolute top-1 left-1 w-6 h-4 rounded-sm" style={{ backgroundColor: theme.colors.clay1 }} />
          <div className="absolute top-5 left-8 w-6 h-4 rounded-sm" style={{ backgroundColor: theme.colors.clay2 }} />
          <div className="absolute top-2 left-10 w-4 h-3 rounded-sm" style={{ backgroundColor: theme.colors.clay3 }} />
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="15" y1="10" x2="40" y2="25" stroke={theme.colors.text} strokeWidth="0.5" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Info Bar (42%) */}
      <div
        className="h-[42%] w-full px-2 flex flex-col justify-center gap-1"
        style={{ backgroundColor: theme.colors.bgElevated }}
      >
        <span className="text-[11px] font-semibold truncate leading-none" style={{ color: theme.colors.text }}>
          {theme.name}
        </span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.clay1 }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.clay2 }} />
        </div>
      </div>
    </div>
  );
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '99,102,241';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

export const ThemePicker: React.FC = () => {
  const { isThemePickerOpen, setThemePickerOpen, currentTheme, setTheme } = useCanvasStore();
  const [isClassicExpanded, setIsClassicExpanded] = useState(false);

  if (!isThemePickerOpen) return null;

  const profThemes = themes.filter(t => t.category === 'professional');
  const classicThemes = themes.filter(t => t.category === 'classic');
  const activeThemeObj = themes.find(t => t.id === currentTheme);

  return (
    <div className="fixed top-12 right-16 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="glass-panel w-[460px] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/5">
          <h3 className="font-sora font-bold text-sm tracking-tight text-text">THEMES</h3>
          <button
            onClick={() => setThemePickerOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-text-muted hover:text-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Professional Section */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-medium tracking-[0.08em] text-text-muted uppercase font-inter">
              PROFESSIONAL
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {profThemes.map(theme => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={currentTheme === theme.id}
                  onSelect={setTheme}
                />
              ))}
            </div>
          </div>

          {/* Classic Section */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsClassicExpanded(!isClassicExpanded)}
              className="flex items-center gap-2 group w-fit"
            >
              <h4 className="text-[10px] font-medium tracking-[0.08em] text-text-muted uppercase font-inter group-hover:text-text transition-colors">
                CLASSIC
              </h4>
              {isClassicExpanded ? (
                <ChevronUp className="w-3 h-3 text-text-muted group-hover:text-text transition-colors" />
              ) : (
                <ChevronDown className="w-3 h-3 text-text-muted group-hover:text-text transition-colors" />
              )}
            </button>

            <div
              className={`
                grid grid-cols-3 gap-3 overflow-hidden transition-all duration-300 ease-in-out
                ${isClassicExpanded ? 'max-h-[400px] opacity-100 mt-1' : 'max-h-0 opacity-0'}
              `}
            >
              {classicThemes.map(theme => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={currentTheme === theme.id}
                  onSelect={setTheme}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-black/20 border-t border-white/5 flex items-center">
          <span className="text-[11px] text-text-muted">
            Active: <span className="text-text font-medium">{activeThemeObj?.name || currentTheme}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
