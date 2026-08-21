export type ThemeName = 'light' | 'dark';

export interface Theme {
  id: ThemeName;
  name: string;
  category: 'professional';
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
  // Legacy properties for backward compatibility
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

// TODO: replace with Stage 4 skeuomorphic tokens
export const themes: Theme[] = [
  {
    id: 'dark',
    name: 'Dark',
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
    id: 'light',
    name: 'Light',
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
  }
];
