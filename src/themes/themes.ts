export type ThemeName =
  | 'lumio-dark'
  | 'chalk'
  | 'midnight'
  | 'sage'
  | 'aurora'
  | 'slate'
  | 'arctic'
  | 'forest'
  | 'sunset'
  | 'candy';

export interface Theme {
  id: ThemeName;
  name: string;
  category: 'professional' | 'classic';
  colors: {
    bg: string;
    bgElevated: string;
    canvasBg: string;
    accent: string;
    text: string;
    clay1: string;
    clay2: string;
    clay3: string;
  };
  // Legacy properties for backward compatibility if needed
  background?: string;
  canvas?: string;
  panel?: string;
  border?: string;
  text?: string;
  textMuted?: string;
  accent?: string;
  accentLight?: string;
  success?: string;
  danger?: string;
  gridColor?: string;
}

export const themes: Theme[] = [
  {
    id: 'lumio-dark',
    name: 'Lumio Dark',
    category: 'professional',
    colors: {
      bg: '#0A0B0F',
      bgElevated: '#12141A',
      canvasBg: '#0D0F14',
      accent: '#6366F1',
      text: '#F1F5F9',
      clay1: '#4F46E5',
      clay2: '#7C3AED',
      clay3: '#0891B2',
    }
  },
  {
    id: 'chalk',
    name: 'Chalk',
    category: 'professional',
    colors: {
      bg: '#F8F7F4',
      bgElevated: '#FFFFFF',
      canvasBg: '#F5F4F0',
      accent: '#4F46E5',
      text: '#1C1917',
      clay1: '#6366F1',
      clay2: '#8B5CF6',
      clay3: '#0EA5E9',
    }
  },
  {
    id: 'midnight',
    name: 'Midnight',
    category: 'professional',
    colors: {
      bg: '#060B18',
      bgElevated: '#0D1628',
      canvasBg: '#080D1C',
      accent: '#3B82F6',
      text: '#E2E8F0',
      clay1: '#1D4ED8',
      clay2: '#1E40AF',
      clay3: '#0E7490',
    }
  },
  {
    id: 'sage',
    name: 'Sage',
    category: 'professional',
    colors: {
      bg: '#0F1510',
      bgElevated: '#161D17',
      canvasBg: '#0C1209',
      accent: '#22C55E',
      text: '#ECFDF5',
      clay1: '#16A34A',
      clay2: '#15803D',
      clay3: '#0F766E',
    }
  },
  {
    id: 'aurora',
    name: 'Aurora',
    category: 'professional',
    colors: {
      bg: '#0C0A1A',
      bgElevated: '#130F24',
      canvasBg: '#090714',
      accent: '#A78BFA',
      text: '#F5F3FF',
      clay1: '#7C3AED',
      clay2: '#6D28D9',
      clay3: '#0E7490',
    }
  },
  {
    id: 'slate',
    name: 'Slate Studio',
    category: 'classic',
    colors: {
      bg: '#0F1117',
      bgElevated: 'rgba(37,40,48,0.65)',
      canvasBg: '#1C1E26',
      accent: '#6366F1',
      text: '#E2E8F0',
      clay1: '#7EB8F7',
      clay2: '#B48EF7',
      clay3: '#6EDBB4',
    },
    background: '#0F1117',
    canvas: '#1C1E26',
    panel: 'rgba(37,40,48,0.65)',
    border: 'rgba(255,255,255,0.08)',
    text: '#E2E8F0',
    textMuted: '#94A3B8',
    accent: '#6366F1',
    accentLight: 'rgba(99,102,241,0.2)',
    success: '#34D399',
    danger: '#F87171',
    gridColor: 'rgba(255,255,255,0.04)',
  },
  {
    id: 'arctic',
    name: 'Arctic White',
    category: 'classic',
    colors: {
      bg: '#F0F4F8',
      bgElevated: 'rgba(255,255,255,0.75)',
      canvasBg: '#FFFFFF',
      accent: '#3B82F6',
      text: '#1A202C',
      clay1: '#7EB8F7',
      clay2: '#B48EF7',
      clay3: '#6EDBB4',
    },
    background: '#F0F4F8',
    canvas: '#FFFFFF',
    panel: 'rgba(255,255,255,0.75)',
    border: 'rgba(0,0,0,0.08)',
    text: '#1A202C',
    textMuted: '#718096',
    accent: '#3B82F6',
    accentLight: 'rgba(59,130,246,0.15)',
    success: '#10B981',
    danger: '#EF4444',
    gridColor: 'rgba(0,0,0,0.05)',
  },
  {
    id: 'forest',
    name: 'Forest Dark',
    category: 'classic',
    colors: {
      bg: '#0D1F17',
      bgElevated: 'rgba(18,43,30,0.75)',
      canvasBg: '#122B1E',
      accent: '#34D399',
      text: '#D1FAE5',
      clay1: '#7EB8F7',
      clay2: '#B48EF7',
      clay3: '#6EDBB4',
    },
    background: '#0D1F17',
    canvas: '#122B1E',
    panel: 'rgba(18,43,30,0.75)',
    border: 'rgba(52,211,153,0.12)',
    text: '#D1FAE5',
    textMuted: '#6EE7B7',
    accent: '#34D399',
    accentLight: 'rgba(52,211,153,0.2)',
    success: '#6EE7B7',
    danger: '#F87171',
    gridColor: 'rgba(52,211,153,0.04)',
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    category: 'classic',
    colors: {
      bg: '#1A0F1F',
      bgElevated: 'rgba(35,18,40,0.75)',
      canvasBg: '#231228',
      accent: '#F59E0B',
      text: '#FEF3C7',
      clay1: '#7EB8F7',
      clay2: '#B48EF7',
      clay3: '#6EDBB4',
    },
    background: '#1A0F1F',
    canvas: '#231228',
    panel: 'rgba(35,18,40,0.75)',
    border: 'rgba(251,191,36,0.12)',
    text: '#FEF3C7',
    textMuted: '#FCD34D',
    accent: '#F59E0B',
    accentLight: 'rgba(245,158,11,0.2)',
    success: '#34D399',
    danger: '#F87171',
    gridColor: 'rgba(245,158,11,0.04)',
  },
  {
    id: 'candy',
    name: 'Candy Pop',
    category: 'classic',
    colors: {
      bg: '#0F0A1E',
      bgElevated: 'rgba(22,13,42,0.75)',
      canvasBg: '#160D2A',
      accent: '#EC4899',
      text: '#FAE8FF',
      clay1: '#7EB8F7',
      clay2: '#B48EF7',
      clay3: '#6EDBB4',
    },
    background: '#0F0A1E',
    canvas: '#160D2A',
    panel: 'rgba(22,13,42,0.75)',
    border: 'rgba(236,72,153,0.15)',
    text: '#FAE8FF',
    textMuted: '#E879F9',
    accent: '#EC4899',
    accentLight: 'rgba(236,72,153,0.2)',
    success: '#22D3EE',
    danger: '#F87171',
    gridColor: 'rgba(236,72,153,0.04)',
  },
];
