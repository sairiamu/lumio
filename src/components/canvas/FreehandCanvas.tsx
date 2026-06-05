import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasStore } from '../../store/canvasStore';

interface FreehandCanvasProps {
  active: boolean;
}

export const FreehandCanvas: React.FC<FreehandCanvasProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const {
    addFreehandStroke,
    freehandStrokes,
    setFreehandStrokes,
    currentTool,
    pushHistory,
    penColor,
    penWidth
  } = useCanvasStore();

  const currentPoints = useRef<{ x: number; y: number }[]>([]);

  const redraw = useCallback(() => {
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
      ctx.globalAlpha = stroke.opacity ?? 1;

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });

    // Draw eraser cursor if active
    if (active && currentTool === 'eraser') {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      const radius = penWidth * 5;
      ctx.arc(mousePos.x, mousePos.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Also a solid inner circle
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.arc(mousePos.x, mousePos.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [freehandStrokes, currentTool, active, mousePos, penWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
  }, [redraw]);

  // Re-draw when dependencies change
  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleEraser = (x: number, y: number) => {
    const radius = penWidth * 5;

    const newStrokes = freehandStrokes.filter(stroke =>
      !stroke.points.some(pt =>
        Math.hypot(pt.x - x, pt.y - y) < radius
      )
    );

    if (newStrokes.length !== freehandStrokes.length) {
      setFreehandStrokes(newStrokes);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!active) return;
    if (currentTool !== 'draw' && currentTool !== 'eraser') return;

    setIsDrawing(true);
    const pos = getPos(e);
    setMousePos(pos);

    if (currentTool === 'draw') {
      currentPoints.current = [pos];
    } else if (currentTool === 'eraser') {
      pushHistory();
      handleEraser(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!active) return;
    const pos = getPos(e);
    setMousePos(pos);

    if (!isDrawing) {
      // If just moving in eraser mode, we still want to redraw the cursor
      if (currentTool === 'eraser') redraw();
      return;
    }

    if (currentTool === 'draw') {
      currentPoints.current.push(pos);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1;

      const points = currentPoints.current;
      if (points.length > 1) {
        ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.stroke();
      }
    } else if (currentTool === 'eraser') {
      handleEraser(pos.x, pos.y);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentTool === 'draw' && currentPoints.current.length > 1) {
      pushHistory();
      addFreehandStroke({
        id: `stroke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        points: [...currentPoints.current],
        color: penColor,
        width: penWidth,
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
      className={`absolute inset-0 z-10 ${
        active
          ? currentTool === 'eraser'
            ? 'cursor-none pointer-events-auto'
            : 'cursor-crosshair pointer-events-auto'
          : 'pointer-events-none'
      }`}
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
