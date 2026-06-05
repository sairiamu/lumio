import { useCallback } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { useReactFlow } from '@xyflow/react';
import { ToolType } from '../types';

export const useCanvasEvents = () => {
  const { currentTool, nodes, setNodes, shapeStyle } = useCanvasStore();
  const { screenToFlowPosition } = useReactFlow();

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (currentTool === 'select' || currentTool === 'draw' || currentTool === 'eraser') return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: `node_${Date.now()}`,
      type: currentTool,
      position,
      data: {
        label: currentTool.charAt(0).toUpperCase() + currentTool.slice(1),
        color: shapeStyle.fill
      },
    };

    setNodes([...nodes, newNode]);
  }, [currentTool, nodes, setNodes, shapeStyle, screenToFlowPosition]);

  return { handleCanvasClick };
};
