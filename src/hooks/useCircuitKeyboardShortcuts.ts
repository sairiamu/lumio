import { useEffect } from 'react';
import { useCircuitStore } from '../store/circuitStore';

export const useCircuitKeyboardShortcuts = () => {
  const { deleteSelected } = useCircuitStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'delete':
        case 'backspace':
          deleteSelected();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelected]);
};
