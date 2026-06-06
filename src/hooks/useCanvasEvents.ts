import { useCallback } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { useReactFlow } from '@xyflow/react';
import { NodeData } from '../types';

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
        title: '',
        parameters: [],
        description: '',
        clayColor: shapeStyle.fill,
      } as NodeData,
    };

    setNodes([...nodes, newNode]);
  }, [currentTool, nodes, setNodes, shapeStyle, screenToFlowPosition]);

  return { handleCanvasClick };
};
