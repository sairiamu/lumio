import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { usePresentationTimer } from '../../hooks/usePresentationTimer';

export const TimerPod: React.FC = () => {
  const { presentationTimer } = useCanvasStore();
  const { progress } = usePresentationTimer();

  const timeRemaining = Math.max(0, Math.ceil(presentationTimer * (1 - progress / 100)));
  const isUrgent = timeRemaining <= 5;
  const isTransitioningToEmber = progress > 80; // < 20% remaining

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-24 h-24 rounded-full flex items-center justify-center group pointer-events-auto">
      {/* Outer Glow Layer */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isUrgent ? 'animate-[urgentPulse_1.5s_infinite]' : ''
        }`}
        style={{
          boxShadow: isUrgent ? undefined : '0 0 24px 6px var(--accent-light)',
          background: 'transparent'
        }}
      />

      {/* Glassmorphism Circle */}
      <div className="absolute inset-0 glass-panel rounded-full z-0" />

      {/* Inner Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span className="text-[28px] font-bold font-sora text-text leading-none">
          {timeRemaining}
        </span>
        <span className="text-[10px] font-inter text-text-muted uppercase tracking-tighter">sec</span>
      </div>

      {/* Progress SVG - Stays on top */}
      <svg className="absolute inset-0 w-full h-full -rotate-90 z-20 pointer-events-none" viewBox="0 0 96 96">
        {/* Track */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="3"
          strokeOpacity="0.1"
        />
        {/* Progress Arc */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={isTransitioningToEmber ? 'var(--danger)' : 'var(--accent)'}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-75 ease-linear"
          style={{
            filter: `drop-shadow(0 0 4px ${isTransitioningToEmber ? 'var(--danger)' : 'var(--accent)'})`
          }}
        />
      </svg>

      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass-panel text-text text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border shadow-xl">
        Auto-advance: {presentationTimer}s
      </div>

      <style>
        {`
          @keyframes urgentPulse {
            0%, 100% { box-shadow: 0 0 24px 6px color-mix(in srgb, var(--danger) 40%, transparent); }
            50% { box-shadow: 0 0 36px 12px color-mix(in srgb, var(--danger) 70%, transparent); }
          }
        `}
      </style>
    </div>
  );
};
