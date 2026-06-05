import React, { useRef, useEffect, useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';

interface FreehandCanvasProps {
  active: boolean;
}

export const FreehandCanvas: React.FC<FreehandCanvasProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { addFreehandStroke, freehandStrokes, currentTool, pushHistory } = useCanvasStore();

  const currentPoints = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match parent
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        redraw();
      }
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, []);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing strokes
    freehandStrokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = stroke.opacity;

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  };

  // Re-draw when strokes change
  useEffect(() => {
    redraw();
  }, [freehandStrokes]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!active || currentTool !== 'draw') return;
    setIsDrawing(true);

    const pos = getPos(e);
    currentPoints.current = [pos];
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !active || currentTool !== 'draw') return;

    const pos = getPos(e);
    currentPoints.current.push(pos);

    // Draw current line segment
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#6366F1';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const points = currentPoints.current;
    if (points.length > 1) {
      ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPoints.current.length > 1) {
      pushHistory();
      addFreehandStroke({
        points: [...currentPoints.current],
        color: getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#6366F1',
        width: 3,
        opacity: 1
      });
    }
    currentPoints.current = [];
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-10 ${active ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
};
