import { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '../store/canvasStore';

export function usePresentationTimer() {
  const {
    isPresentationPlaying,
    presentationTimer,
    stepNodes,
    currentStep,
    nextStep,
    presentationLoop,
    setIsPresentationPlaying,
    setIsPresentationFinished
  } = useCanvasStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPresentationPlaying || stepNodes.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(0);
      return;
    }

    const TICK = 50; // ms — smooth progress bar update
    const totalTicks = (presentationTimer * 1000) / TICK;
    progressRef.current = 0;

    intervalRef.current = setInterval(() => {
      progressRef.current += 1;
      setProgress((progressRef.current / totalTicks) * 100);

      if (progressRef.current >= totalTicks) {
        progressRef.current = 0;
        setProgress(0);

        const isLast = currentStep >= stepNodes.length - 1;
        if (isLast && !presentationLoop) {
          setIsPresentationPlaying(false);
          setIsPresentationFinished(true);
          return;
        }
        nextStep();
      }
    }, TICK);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPresentationPlaying, presentationTimer, currentStep, stepNodes, presentationLoop, nextStep, setIsPresentationPlaying]);

  return { progress };
}
