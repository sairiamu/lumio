import React, { useState, useEffect, useCallback } from 'react';
import { DraggablePod } from './DraggablePod';
import { NavPod } from './NavPod';
import { TimerPod } from './TimerPod';
import { SpeedPod } from './SpeedPod';
import { SystemPod } from './SystemPod';
import { SlideCounterPod } from './SlideCounterPod';
import { FocusTogglePod } from './FocusTogglePod';
import { useCanvasStore } from '../../store/canvasStore';

export const PresentationMode: React.FC = () => {
  const { isPresentationMode, stepNodes, isPresentationFinished } = useCanvasStore();
  const [opacity, setOpacity] = useState(1);
  const [tempHidden, setTempHidden] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [draggingPodId, setDraggingPodId] = useState<string | null>(null);

  // Idle fade
  useEffect(() => {
    if (!isPresentationMode || tempHidden) return;

    let fadeTimer: ReturnType<typeof setTimeout>;
    const handleMouseMove = () => {
      setOpacity(1);
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => {
        setOpacity(0.15);
      }, 4000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    handleMouseMove();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(fadeTimer);
    };
  }, [isPresentationMode, tempHidden]);

  const handleHideAll = useCallback(() => {
    setTempHidden(true);
    setTimeout(() => setTempHidden(false), 3000);
  }, []);

  if (!isPresentationMode || stepNodes.length === 0 || isPresentationFinished) return null;

  const displayOpacity = tempHidden ? 0 : opacity;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9998] transition-opacity duration-600"
      style={{ opacity: displayOpacity }}
    >
      <DraggablePod
        id="focus"
        defaultPosition={{ x: 32, y: 32 }}
        delay={0}
        onDragStateChange={(isDragging) => setDraggingPodId(isDragging ? 'focus' : null)}
        otherPodsDragging={draggingPodId !== null}
      >
        <FocusTogglePod isFocusMode={isFocusMode} onToggle={() => setIsFocusMode(!isFocusMode)} />
      </DraggablePod>

      {!isFocusMode && (
        <>
          <DraggablePod
            id="nav"
            defaultPosition={{ x: window.innerWidth / 2 - 120, y: window.innerHeight - 100 }}
            delay={80}
            onDragStateChange={(isDragging) => setDraggingPodId(isDragging ? 'nav' : null)}
            otherPodsDragging={draggingPodId !== null}
          >
            <NavPod />
          </DraggablePod>

          <DraggablePod
            id="speed"
            defaultPosition={{ x: 40, y: window.innerHeight - 100 }}
            delay={160}
            onDragStateChange={(isDragging) => setDraggingPodId(isDragging ? 'speed' : null)}
            otherPodsDragging={draggingPodId !== null}
          >
            <SpeedPod />
          </DraggablePod>

          <DraggablePod
            id="system"
            defaultPosition={{ x: window.innerWidth - 160, y: 32 }}
            delay={240}
            onDragStateChange={(isDragging) => setDraggingPodId(isDragging ? 'system' : null)}
            otherPodsDragging={draggingPodId !== null}
          >
            <SystemPod onHideAll={handleHideAll} />
          </DraggablePod>

          <DraggablePod
            id="slidecount"
            defaultPosition={{ x: window.innerWidth / 2 - 50, y: 32 }}
            delay={320}
            onDragStateChange={(isDragging) => setDraggingPodId(isDragging ? 'slidecount' : null)}
            otherPodsDragging={draggingPodId !== null}
          >
            <SlideCounterPod />
          </DraggablePod>
        </>
      )}

      {isFocusMode && (
        <DraggablePod
          id="timer"
          defaultPosition={{ x: window.innerWidth - 140, y: window.innerHeight - 140 }}
          delay={80}
          onDragStateChange={(isDragging) => setDraggingPodId(isDragging ? 'timer' : null)}
          otherPodsDragging={draggingPodId !== null}
        >
          <TimerPod />
        </DraggablePod>
      )}
    </div>
  );
};
