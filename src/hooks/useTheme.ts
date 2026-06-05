import { useEffect } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { themes } from '../themes/themes';

export const useTheme = () => {
  const currentThemeName = useCanvasStore((state) => state.currentTheme);

  useEffect(() => {
    const theme = themes[currentThemeName];
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--bg', theme.background);
    root.style.setProperty('--canvas', theme.canvas);
    root.style.setProperty('--panel', theme.panel);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-light', theme.accentLight);
    root.style.setProperty('--success', theme.success);
    root.style.setProperty('--danger', theme.danger);
    root.style.setProperty('--grid-color', theme.gridColor);
  }, [currentThemeName]);
};
