export type ThemeName = 'slate' | 'arctic' | 'forest' | 'sunset' | 'candy';

export interface Theme {
  name: string;
  background: string;
  canvas: string;
  panel: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  success: string;
  danger: string;
  gridColor: string;
}

export const themes: Record<ThemeName, Theme> = {
  slate: {
    // current default — dark professional
    name: 'Slate Studio',
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

  arctic: {
    // light clean minimal
    name: 'Arctic White',
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

  forest: {
    // deep green nature
    name: 'Forest Dark',
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

  sunset: {
    // warm amber purple
    name: 'Sunset Glow',
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

  candy: {
    // vibrant playful pink/cyan
    name: 'Candy Pop',
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
};
