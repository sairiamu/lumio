import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';

const PRESET_COLORS = [
  '#7EB8F7', '#B48EF7', '#6EDBB4', '#F7A97E', '#F78EBF',
  '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#FF9FF3', '#54A0FF',
  '#FDA7DF', '#D980FA', '#9980FA', '#C4E538', '#FFE0B2', '#B2EBF2',
  '#2C3E50', '#636E72', '#B2BEC3', '#DFE6E9', '#FFFFFF', '#1C1E26',
  '#6366F1', '#34D399', '#F87171', '#FBBF24',
];

const COLOR_TABS = ['fill', 'stroke'] as const;
type ColorTab = (typeof COLOR_TABS)[number];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const expandHex = (hex: string) => {
  const shorthand = /^#([a-fA-F0-9]{3})$/;
  if (shorthand.test(hex)) {
    return hex.replace(shorthand, (_match, chars) => `#${chars[0]}${chars[0]}${chars[1]}${chars[1]}${chars[2]}${chars[2]}`);
  }
  return hex;
};

const normalizeHex = (hex: string) => {
  const normalized = hex.trim();
  if (!normalized.startsWith('#')) return null;
  if (/^#[A-Fa-f0-9]{6}$/.test(normalized)) return normalized.toUpperCase();
  if (/^#[A-Fa-f0-9]{3}$/.test(normalized)) return expandHex(normalized).toUpperCase();
  return null;
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()}`;

const hexToRgba = (hex: string, opacity: number) => {
  const normalized = normalizeHex(hex) ?? '#FFFFFF';
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};

const parseColorValue = (value: string) => {
  const rgbaMatch = value.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([0-9.]+)\s*\)/i);
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    return {
      hex: rgbToHex(Number(r), Number(g), Number(b)),
      opacity: clamp(Math.round(Number(a) * 100), 0, 100),
    };
  }

  const hex = normalizeHex(value);
  if (hex) {
    return { hex, opacity: 100 };
  }

  return { hex: '#FFFFFF', opacity: 100 };
};

const formatColorValue = (hex: string, opacity: number) => {
  const normalized = normalizeHex(hex);
  if (!normalized) return '#FFFFFF';
  return opacity === 100 ? normalized : hexToRgba(normalized, opacity);
};

const isValidHex = (value: string) => normalizeHex(value) !== null;

export const ColourPicker: React.FC<{ mode?: 'node' | 'edge' }> = ({ mode = 'node' }) => {
  const { nodes, edges, selectedNodeIds, selectedEdgeIds, updateNodeData, updateEdgeData } = useCanvasStore();

  const selectedNode = useMemo(
    () => nodes.find((node) => selectedNodeIds.includes(node.id)),
    [nodes, selectedNodeIds]
  );

  const selectedEdge = useMemo(
    () => edges.find((edge) => selectedEdgeIds.includes(edge.id)),
    [edges, selectedEdgeIds]
  );

  const fillValue = mode === 'node' ? (selectedNode?.data.color ?? '#7EB8F7') : 'transparent';
  const strokeValue = mode === 'node'
    ? (selectedNode?.data.strokeColor ?? 'rgba(255,255,255,0.2)')
    : (selectedEdge?.data?.strokeColor ?? '#94A3B8');

  const parsedFill = useMemo(() => parseColorValue(fillValue), [fillValue]);
  const parsedStroke = useMemo(() => parseColorValue(strokeValue), [strokeValue]);

  const [activeTab, setActiveTab] = useState<ColorTab>(mode === 'node' ? 'fill' : 'stroke');
  const [fillHex, setFillHex] = useState(parsedFill.hex);
  const [fillOpacity, setFillOpacity] = useState(parsedFill.opacity);
  const [strokeHex, setStrokeHex] = useState(parsedStroke.hex);
  const [strokeOpacity, setStrokeOpacity] = useState(parsedStroke.opacity);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFillHex(parsedFill.hex);
    setFillOpacity(parsedFill.opacity);
    setStrokeHex(parsedStroke.hex);
    setStrokeOpacity(parsedStroke.opacity);
  }, [parsedFill.hex, parsedFill.opacity, parsedStroke.hex, parsedStroke.opacity]);

  const activeHex = activeTab === 'fill' ? fillHex : strokeHex;
  const activeOpacity = activeTab === 'fill' ? fillOpacity : strokeOpacity;

  const applyColorUpdate = (nextHex: string, nextOpacity: number) => {
    const formatted = formatColorValue(nextHex, nextOpacity);
    if (mode === 'node' && selectedNode) {
      if (activeTab === 'fill') {
        updateNodeData(selectedNode.id, { color: formatted });
      } else {
        updateNodeData(selectedNode.id, { strokeColor: formatted });
      }
    } else if (mode === 'edge' && selectedEdge) {
      updateEdgeData(selectedEdge.id, { strokeColor: formatted });
    }
  };

  const handleSwatchSelect = (color: string) => {
    if (activeTab === 'fill') {
      setFillHex(color);
      applyColorUpdate(color, fillOpacity);
    } else {
      setStrokeHex(color);
      applyColorUpdate(color, strokeOpacity);
    }
  };

  const handleHexChange = (value: string) => {
    const cleaned = value.startsWith('#') ? value : `#${value}`;
    if (activeTab === 'fill') {
      setFillHex(cleaned);
      if (isValidHex(cleaned)) applyColorUpdate(cleaned, fillOpacity);
    } else {
      setStrokeHex(cleaned);
      if (isValidHex(cleaned)) applyColorUpdate(cleaned, strokeOpacity);
    }
  };

  const handleOpacityChange = (value: number) => {
    const nextOpacity = clamp(value, 0, 100);
    if (activeTab === 'fill') {
      setFillOpacity(nextOpacity);
      if (isValidHex(fillHex)) applyColorUpdate(fillHex, nextOpacity);
    } else {
      setStrokeOpacity(nextOpacity);
      if (isValidHex(strokeHex)) applyColorUpdate(strokeHex, nextOpacity);
    }
  };

  const handleCustomColor = (value: string) => {
    const normalized = normalizeHex(value) ?? '#FFFFFF';
    if (activeTab === 'fill') {
      setFillHex(normalized);
      applyColorUpdate(normalized, fillOpacity);
    } else {
      setStrokeHex(normalized);
      applyColorUpdate(normalized, strokeOpacity);
    }
  };

  const openColorInput = () => {
    colorInputRef.current?.click();
  };

  const isSelectedSwatch = (color: string) => normalizeHex(color) === normalizeHex(activeHex);

  return (
    <div className="flex flex-col gap-4">
      {mode === 'node' && (
        <div className="grid grid-cols-2 rounded-xl overflow-hidden border border-white/10 bg-white/5 text-[11px]">
          {COLOR_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-iris text-void'
                  : 'bg-graphite/80 text-cloud hover:bg-white/10'
              }`}
            >
              {tab === 'fill' ? 'Fill' : 'Stroke'}
            </button>
          ))}
        </div>
      )}

      {mode === 'edge' && (
        <label className="block text-[10px] font-sora uppercase tracking-[0.18em] text-fog mb-[-8px]">
          Line Colour
        </label>
      )}

      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => handleSwatchSelect(color)}
            className={`h-7 w-7 rounded-xl transition-transform duration-150 ${
              isSelectedSwatch(color)
                ? 'ring-2 ring-offset-1 ring-iris'
                : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Preset colour ${color}`}
          />
        ))}
      </div>

      <div className="flex items-end gap-3">
        <div className="rounded-2xl bg-linear-to-br from-iris/70 via-white/10 to-amber-400 p-px">
          <button
            type="button"
            onClick={openColorInput}
            className="min-w-23 rounded-2xl bg-graphite/80 px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-cloud transition hover:border-white/20"
          >
            Custom
          </button>
        </div>

        <input
          ref={colorInputRef}
          type="color"
          value={isValidHex(activeHex) ? activeHex : '#FFFFFF'}
          onChange={(event) => handleCustomColor(event.target.value)}
          className="sr-only"
        />

        <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <label className="block text-[10px] font-sora uppercase tracking-[0.18em] text-fog">Hex</label>
          <input
            type="text"
            value={activeHex}
            onChange={(event) => handleHexChange(event.target.value)}
            className="mt-1 w-full bg-transparent text-[13px] font-mono text-cloud outline-none placeholder:text-fog"
            placeholder="#000000"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-fog">
          <span>Opacity</span>
          <span>{activeOpacity}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={activeOpacity}
          onChange={(event) => handleOpacityChange(Number(event.target.value))}
          className="w-full accent-iris"
        />
      </div>
    </div>
  );
};
