import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DraggablePodProps {
  id: string;
  defaultPosition: Position;
  children: React.ReactNode;
  delay?: number;
  onDragStateChange?: (isDragging: boolean) => void;
  otherPodsDragging?: boolean;
}

export const DraggablePod: React.FC<DraggablePodProps> = ({
  id,
  defaultPosition,
  children,
  delay = 0,
  onDragStateChange,
  otherPodsDragging
}) => {
  const [position, setPosition] = useState<Position>(() => {
    const saved = localStorage.getItem(`lumio_pod_position_${id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultPosition;
      }
    }
    return defaultPosition;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartOffset = useRef<Position>({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    onDragStateChange?.(true);
    dragStartOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartOffset.current.x,
      y: e.clientY - dragStartOffset.current.y,
    });
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragStateChange?.(false);
      localStorage.setItem(`lumio_pod_position_${id}`, JSON.stringify(position));
    }
  }, [id, isDragging, position, onDragStateChange]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  return (
    <div
      onMouseDown={onMouseDown}
      className={`fixed z-[9999] cursor-grab active:cursor-grabbing transition-all duration-150 animate-fade-in ${
        isDragging ? 'scale-[1.05] brightness-110 !transition-none' : 'hover:scale-[1.02]'
      } ${otherPodsDragging && !isDragging ? 'pointer-events-none' : 'pointer-events-auto'}`}
      style={{
        left: position.x,
        top: position.y,
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className={`rounded-full shadow-2xl transition-shadow duration-150 ${isDragging ? 'shadow-accent/40 ring-1 ring-accent/20' : ''}`}
           style={{ boxShadow: isDragging ? '0 0 30px 5px var(--accent-light)' : undefined }}>
        {children}
      </div>
    </div>
  );
};
