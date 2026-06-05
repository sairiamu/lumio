import { toPng, toSvg } from 'html-to-image';
import { useCanvasStore } from '../store/canvasStore';

export async function exportPNG(): Promise<Uint8Array> {
  // Target the inner viewport — not the outer wrapper
  const node = document.querySelector('.react-flow__viewport') as HTMLElement;
  if (!node) throw new Error('Viewport element not found');

  // Make sure SVG edges are visible to html-to-image
  // Force all edge SVG elements to have explicit dimensions
  const svgEls = node.querySelectorAll('svg');
  svgEls.forEach((svg) => {
    if (!svg.getAttribute('width')) {
      const box = svg.getBoundingClientRect();
      svg.setAttribute('width', String(box.width));
      svg.setAttribute('height', String(box.height));
    }
  });

  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: '#1C1E26',
    includeQueryParams: true,
    skipFonts: false,
  });

  const base64 = dataUrl.split(',')[1];
  if (!base64) throw new Error('Invalid image data');

  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export async function exportSVG(): Promise<Uint8Array> {
  const node = document.querySelector('.react-flow') as HTMLElement;
  if (!node) throw new Error('Canvas not found');

  const dataUrl = await toSvg(node, {
    backgroundColor: '#1C1E26',
    filter: (child) => {
      if (child instanceof Element) {
        if (child.classList.contains('react-flow__controls')) return false;
        if (child.classList.contains('react-flow__minimap')) return false;
      }
      return true;
    }
  });

  // CRITICAL: extract actual SVG string from data URL
  let svgString: string;

  if (dataUrl.includes('base64,')) {
    // base64 encoded — decode it
    const base64 = dataUrl.split('base64,')[1];
    svgString = atob(base64);
  } else {
    // plain URI encoded — decode URI component
    const encoded = dataUrl.split('data:image/svg+xml;charset=utf-8,')[1];
    svgString = decodeURIComponent(encoded);
  }

  // Verify it starts with < before writing
  const trimmed = svgString.trimStart();
  if (!trimmed.startsWith('<')) {
    throw new Error('SVG extraction failed — content does not start with <');
  }

  const encoder = new TextEncoder();
  return encoder.encode(trimmed);
}

export function buildProjectJSON(): string {
  const state = useCanvasStore.getState();
  const project = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    nodes: state.nodes,
    edges: state.edges,
    freehandStrokes: state.freehandStrokes,
    shapeStyle: state.shapeStyle,
  };

  return JSON.stringify(project, null, 2);
}

export function showToast(message: string, type: 'success' | 'error'): void {
  const containerId = 'vibeplan-toast-container';
  let container = document.getElementById(containerId) as HTMLDivElement | null;

  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.style.position = 'fixed';
    container.style.bottom = '24px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.gap = '8px';
    container.style.zIndex = '9999';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.padding = '12px 18px';
  toast.style.borderRadius = '999px';
  toast.style.fontFamily = 'Inter, sans-serif';
  toast.style.fontSize = '14px';
  toast.style.color = '#FFFFFF';
  toast.style.maxWidth = '90vw';
  toast.style.boxShadow = '0 14px 30px rgba(0, 0, 0, 0.15)';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 200ms ease-in-out';
  toast.style.pointerEvents = 'auto';
  toast.style.backgroundColor = type === 'success' ? '#22c55e' : '#ef4444';
  toast.style.textAlign = 'center';

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });

  window.setTimeout(() => {
    toast.style.opacity = '0';
    window.setTimeout(() => {
      toast.remove();
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, 200);
  }, 2000);
}
