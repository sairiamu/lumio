import { useEffect, useRef } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { themes } from '../themes/themes';

export const useTheme = () => {
  const currentThemeName = useCanvasStore((state) => state.currentTheme);
  const animationsEnabled = useCanvasStore((state) => state.animationsEnabled);
  const isFirstRender = useRef(true);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--animation-state',
      animationsEnabled ? 'running' : 'paused'
    );
  }, [animationsEnabled]);

  useEffect(() => {
    const theme = themes.find(t => t.id === currentThemeName);
    if (!theme) return;

    if (isFirstRender.current) {
      document.documentElement.setAttribute('data-theme', currentThemeName);
      isFirstRender.current = false;
      return;
    }

    // Theme transition animation
    let overlay = document.getElementById('theme-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'theme-overlay';
      document.body.appendChild(overlay);
    }

    overlay.style.backgroundColor = theme.colors.bg;
    overlay.classList.add('active');

    const timeout = setTimeout(() => {
      document.documentElement.setAttribute('data-theme', currentThemeName);

      setTimeout(() => {
        overlay?.classList.remove('active');
      }, 175);
    }, 175);

    return () => clearTimeout(timeout);
  }, [currentThemeName]);
};
