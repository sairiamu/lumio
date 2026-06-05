import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
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
    projectName: state.projectName,
    exportedAt: new Date().toISOString(),
    nodes: state.nodes,
    edges: state.edges,
    freehandStrokes: state.freehandStrokes,
    shapeStyle: state.shapeStyle,
  };

  return JSON.stringify(project, null, 2);
}

export async function exportPDF(): Promise<Uint8Array> {
  const node = document.querySelector('.react-flow__viewport') as HTMLElement;
  if (!node) throw new Error('Canvas not found');

  // Ensure SVG elements have dimensions for capture
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

  const bounds = node.getBoundingClientRect();
  const w = bounds.width;
  const h = bounds.height;
  const orientation = w > h ? 'landscape' : 'portrait';

  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [w, h],
    hotfixes: ['px_scaling'],
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, w, h);
  return pdf.output('uint8array');
}

export async function copyCanvasToClipboard(): Promise<void> {
  const node = document.querySelector('.react-flow__viewport') as HTMLElement;
  if (!node) throw new Error('Canvas not found');

  // Ensure SVG elements have dimensions for capture
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

  const res = await fetch(dataUrl);
  const blob = await res.blob();

  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob })
  ]);
}

export function showToast(message: string, type: 'success' | 'error' | 'info'): void {
  useCanvasStore.getState().addToast(message, type);
}
