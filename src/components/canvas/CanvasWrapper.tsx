import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { DiagramCanvas } from './DiagramCanvas';
import { FreehandCanvas } from './FreehandCanvas';
import { CanvasControls } from './CanvasControls';
import { AlignmentGuides } from './AlignmentGuides';
import { NodeSearch } from './NodeSearch';
import { PresentationMode } from '../presentation/PresentationMode';
import { PresentationFinishedOverlay } from '../shell/PresentationFinishedOverlay';
import { ExportModal } from '../modals/ExportModal';
import { ShareModal } from '../modals/ShareModal';
import { ShapeLibrary } from '../panels/ShapeLibrary';
import { useCanvasStore } from '../../store/canvasStore';

export const CanvasWrapper: React.FC = () => {
  const { canvasMode, isPresentationMode, stepNodes, currentStep, nextStep, prevStep } = useCanvasStore();
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (isPresentationMode && currentStep !== -1 && stepNodes[currentStep]) {
      fitView({
        nodes: [{ id: stepNodes[currentStep] }],
        padding: 0.3,
        duration: 600,
      });
    }
  }, [currentStep, isPresentationMode, stepNodes, fitView]);

  return (
    <div className="w-full h-full relative bg-canvas">
      {/* The diagram canvas is always present but its interaction might be limited when drawing */}
      <DiagramCanvas />

      {/* The freehand canvas sits on top */}
      <FreehandCanvas active={canvasMode === 'freehand'} />

      <AlignmentGuides />

      <NodeSearch />

      {!isPresentationMode && <CanvasControls />}

      <ShapeLibrary />

      <PresentationMode />

      <PresentationFinishedOverlay />

      <ExportModal />
      <ShareModal />
    </div>
  );
};
