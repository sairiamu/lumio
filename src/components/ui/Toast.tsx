import React from 'react';
import { useCanvasStore, ToastMessage } from '../../store/canvasStore';

const Toast: React.FC<ToastMessage> = ({ message, type }) => {
  const bgColor = {
    success: 'var(--success)', // Mint
    error: 'var(--danger)',   // Ember
    info: 'var(--accent)',    // Iris
  }[type];

  return (
    <div
      className="px-5 py-2.5 rounded-full shadow-2xl text-white font-medium text-sm flex items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-300"
      style={{ backgroundColor: bgColor }}
    >
      {message}
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useCanvasStore((state) => state.toasts);

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none items-center">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
