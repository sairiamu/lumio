/**
 * Centralized layout configuration for the Lumio layout engine utilities.
 * Defines professional defaults to produce readable architecture diagrams
 * with clear visual hierarchy, avoiding magic numbers across the codebase.
 */
export const LAYOUT_CONFIG = {
  // Spacing between individual nodes on the same level/rank
  nodeSpacing: 90,

  // Spacing between consecutive ranks or layers of nodes
  levelSpacing: 160,

  // Additional spacing padding used when sorting or grouping multi-component blocks
  componentSpacing: 120,

  // Padding buffer applied around the canvas elements when adapting or viewing layouts
  canvasPadding: 0.25,
} as const;

export const LAYOUT_PRESETS = {
  'architecture-flow': {
    direction: 'LR' as const,
    nodeSpacing: 100,
    levelSpacing: 180,
    componentSpacing: 140,
    canvasPadding: 0.25,
  },
  'top-down': {
    direction: 'TB' as const,
    nodeSpacing: 100,
    levelSpacing: 160,
    componentSpacing: 140,
    canvasPadding: 0.25,
  },
  'compact': {
    direction: 'LR' as const,
    nodeSpacing: 60,
    levelSpacing: 100,
    componentSpacing: 80,
    canvasPadding: 0.15,
  },
  'presentation': {
    direction: 'LR' as const,
    nodeSpacing: 140,
    levelSpacing: 240,
    componentSpacing: 200,
    canvasPadding: 0.3,
  }
} as const;

export type LayoutPresetType = keyof typeof LAYOUT_PRESETS;
export type LayoutConfig = typeof LAYOUT_CONFIG;
