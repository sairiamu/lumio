import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { ColourPicker } from './ColourPicker';
import {
  Minus,
  GripHorizontal,
  MoreHorizontal,
  ArrowRight,
  Circle as CircleIcon,
  Square,
  Spline,
  GitCommit,
  ArrowUpRight,
  Ban,
  Waves,
  HeartPulse,
  Repeat,
  Radio
} from 'lucide-react';

export const EdgePropertiesPanel: React.FC = () => {
  const { edges, selectedEdgeIds, updateEdgeData } = useCanvasStore();
  const selectedEdge = edges.find((e) => selectedEdgeIds.includes(e.id));

  if (!selectedEdge) return null;

  const strokeWidth = selectedEdge.data?.strokeWidth ?? 2;
  const strokeStyle = selectedEdge.data?.strokeStyle ?? 'solid';
  const lineStart = selectedEdge.data?.lineStart ?? 'none';
  const lineEnd = selectedEdge.data?.lineEnd ?? 'none';
  const pathType = selectedEdge.data?.pathType ?? 'default';
  const animationType = selectedEdge.data?.animationType ?? 'none';
  const animationSpeed = selectedEdge.data?.animationSpeed ?? 'normal';
  const animationColor = selectedEdge.data?.animationColor;

  const animationColors = [
    '#E2E8F0', '#6366F1', '#34D399', '#F87171',
    '#FBBF24', '#EC4899', '#22D3EE', '#000000'
  ];

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* COLOUR ROW */}
      <ColourPicker mode="edge" />

      {/* ANIMATION SECTION */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
        <label className="text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted font-semibold">Animation</label>

        {/* TYPE ROW */}
        <div className="grid grid-cols-5 gap-1">
          {[
            { label: 'None', value: 'none', icon: <Ban className="w-3.5 h-3.5" /> },
            { label: 'Flow', value: 'flow', icon: <Waves className="w-3.5 h-3.5" /> },
            { label: 'Pulse', value: 'pulse', icon: <HeartPulse className="w-3.5 h-3.5" /> },
            { label: 'March', value: 'dash-march', icon: <Repeat className="w-3.5 h-3.5" /> },
            { label: 'Signal', value: 'signal', icon: <Radio className="w-3.5 h-3.5" /> },
          ].map((a) => (
            <button
              key={a.value}
              onClick={() => updateEdgeData(selectedEdge.id, { animationType: a.value as any })}
              className={`py-2 flex flex-col items-center gap-1 rounded-lg transition-all border ${
                animationType === a.value
                  ? 'bg-accent border-accent text-white shadow-md'
                  : 'bg-white/5 border-transparent text-text-muted hover:bg-white/10'
              }`}
              title={a.label}
            >
              <div className={animationType === a.value ? 'text-white' : 'text-accent'}>{a.icon}</div>
              <span className="text-[8px] font-bold uppercase">{a.label}</span>
            </button>
          ))}
        </div>

        {animationType !== 'none' && (
          <>
            {/* SPEED ROW */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-text-muted/60 uppercase">Speed</span>
              <div className="grid grid-cols-3 gap-2">
                {['slow', 'normal', 'fast'].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateEdgeData(selectedEdge.id, { animationSpeed: s as any })}
                    className={`py-1.5 text-[10px] font-bold rounded-lg border transition ${
                      animationSpeed === s
                        ? 'bg-accent border-accent text-white'
                        : 'bg-white/5 border-border text-text'
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOUR ROW (Flow/Signal only) */}
            {(animationType === 'flow' || animationType === 'signal') && (
              <div className="flex flex-col gap-2">
                <span className="text-[9px] text-text-muted/60 uppercase">Animation Colour</span>
                <div className="flex flex-wrap gap-1.5">
                  {animationColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateEdgeData(selectedEdge.id, { animationColor: color })}
                      className={`w-5 h-5 rounded-full border border-white/10 transition-transform hover:scale-110 ${
                        animationColor === color ? 'ring-2 ring-accent ring-offset-1 ring-offset-[#1C1E26]' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <div className="relative w-5 h-5 rounded-full border border-white/10 overflow-hidden hover:scale-110 transition-all">
                    <input
                      type="color"
                      value={animationColor || '#FFFFFF'}
                      onChange={(e) => updateEdgeData(selectedEdge.id, { animationColor: e.target.value })}
                      className="absolute -top-1 -left-1 w-[150%] h-[150%] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* THICKNESS ROW */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted font-semibold">Thickness</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Thin', value: 1 },
            { label: 'Normal', value: 2 },
            { label: 'Thick', value: 4 },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => updateEdgeData(selectedEdge.id, { strokeWidth: t.value })}
              className={`py-2.5 text-[11px] font-bold rounded-xl transition-all duration-200 border ${
                strokeWidth === t.value
                  ? 'bg-accent border-accent text-white shadow-lg'
                  : 'bg-white/5 border-border text-text hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* STYLE ROW */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted font-semibold">Line Style</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Solid', value: 'solid', icon: <Minus className="w-4 h-4" /> },
            { label: 'Dashed', value: 'dashed', icon: <GripHorizontal className="w-4 h-4" /> },
            { label: 'Dotted', value: 'dotted', icon: <MoreHorizontal className="w-4 h-4" /> },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => updateEdgeData(selectedEdge.id, { strokeStyle: s.value as any })}
              className={`py-3 flex flex-col items-center gap-2 rounded-xl transition-all duration-200 border ${
                strokeStyle === s.value
                  ? 'bg-accent border-accent text-white shadow-lg'
                  : 'bg-white/5 border-border text-text hover:bg-white/10'
              }`}
            >
              <div className={strokeStyle === s.value ? 'text-white' : 'text-accent'}>
                {s.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PATH TYPE ROW */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted font-semibold">Path Type</label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Bez', value: 'default', icon: <Spline className="w-3.5 h-3.5" /> },
            { label: 'Step', value: 'step', icon: <GitCommit className="w-3.5 h-3.5" /> },
            { label: 'Str', value: 'straight', icon: <Minus className="w-3.5 h-3.5 rotate-[-45deg]" /> },
            { label: 'Sm', value: 'smooth', icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => updateEdgeData(selectedEdge.id, { pathType: p.value as any })}
              className={`py-2 flex flex-col items-center gap-1 rounded-lg transition-all border ${
                pathType === p.value
                  ? 'bg-accent border-accent text-white'
                  : 'bg-white/5 border-border text-text hover:bg-white/10'
              }`}
              title={p.label}
            >
              <div className={pathType === p.value ? 'text-white' : 'text-accent'}>{p.icon}</div>
              <span className="text-[9px] font-bold uppercase">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* JOINTERS / MARKERS */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-sora uppercase tracking-[0.18em] text-text-muted font-semibold">Jointers (Start / End)</label>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <span className="text-[9px] text-text-muted/60 uppercase text-center">Start</span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { value: 'none', icon: <Square className="w-3 h-3 opacity-20" /> },
                { value: 'arrow', icon: <ArrowRight className="w-3.5 h-3.5 rotate-180" /> },
                { value: 'circle', icon: <CircleIcon className="w-3 h-3 fill-current" /> },
              ].map((m) => (
                <button
                  key={m.value}
                  onClick={() => updateEdgeData(selectedEdge.id, { lineStart: m.value as any })}
                  className={`py-2 flex justify-center rounded-lg border transition ${
                    lineStart === m.value ? 'bg-accent border-accent text-white' : 'bg-white/5 border-border text-accent'
                  }`}
                >
                  {m.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <span className="text-[9px] text-text-muted/60 uppercase text-center">End</span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { value: 'none', icon: <Square className="w-3 h-3 opacity-20" /> },
                { value: 'arrow', icon: <ArrowRight className="w-3.5 h-3.5" /> },
                { value: 'circle', icon: <CircleIcon className="w-3 h-3 fill-current" /> },
              ].map((m) => (
                <button
                  key={m.value}
                  onClick={() => updateEdgeData(selectedEdge.id, { lineEnd: m.value as any })}
                  className={`py-2 flex justify-center rounded-lg border transition ${
                    lineEnd === m.value ? 'bg-accent border-accent text-white' : 'bg-white/5 border-border text-accent'
                  }`}
                >
                  {m.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
