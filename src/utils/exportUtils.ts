import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useCanvasStore } from '../store/canvasStore';
import { Node, Edge } from '@xyflow/react';
import { NodeData, EdgeData, Stroke, ShapeStyle, ProjectMetadata } from '../types';

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

export const LUMIO_PROJECT_VERSION = '1.2';

export interface LumioProject {
  version: string;
  projectName: string;
  projectType: 'elemental-sketch' | 'electrical';
  exportedAt: string;
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  freehandStrokes: Stroke[];
  shapeStyle: ShapeStyle;
  metadata?: ProjectMetadata;
}

export function migrateProject(json: unknown): LumioProject {
  if (!json || typeof json !== 'object' || json === null) {
    return json as LumioProject;
  }

  let migrated = JSON.parse(JSON.stringify(json));
  let version = migrated.version || '1.0';

  // Step 1: 1.0 -> 1.1 (Node/Edge Semantics)
  if (version === '1.0') {
    if (Array.isArray(migrated.nodes)) {
      migrated.nodes = migrated.nodes.map((node: any) => {
        if (node.data && !node.data.semantic) {
          node.data = {
            ...node.data,
            semantic: { category: 'generic', metadata: {} }
          };
        }
        return node;
      });
    }
    if (Array.isArray(migrated.edges)) {
      migrated.edges = migrated.edges.map((edge: any) => {
        if (edge.data && !edge.data.semantic) {
          edge.data = {
            ...edge.data,
            semantic: { relationship: 'generic', metadata: {} }
          };
        }
        return edge;
      });
    }
    version = '1.1';
  }

  // Step 2: 1.1 -> 1.2 (Project Metadata)
  if (version === '1.1') {
    if (!migrated.metadata) {
      migrated.metadata = {
        description: '',
        tags: [],
        createdWith: 'Lumio'
      };
    }
    version = '1.2';
  }

  // Final updates
  migrated.version = LUMIO_PROJECT_VERSION;

  // Backwards compatibility safety check: Ensure all nodes/edges have semantic metadata even if version was high
  if (Array.isArray(migrated.nodes)) {
    migrated.nodes.forEach((node: any) => {
      if (node.data && !node.data.semantic) {
        node.data.semantic = { category: 'generic', metadata: {} };
      }
    });
  }
  if (Array.isArray(migrated.edges)) {
    migrated.edges.forEach((edge: any) => {
      if (edge.data && !edge.data.semantic) {
        edge.data.semantic = { relationship: 'generic', metadata: {} };
      }
    });
  }

  return migrated as LumioProject;
}

export function buildProjectJSON(): string {
  const state = useCanvasStore.getState();
  const project: LumioProject = {
    version: LUMIO_PROJECT_VERSION,
    projectName: state.projectName,
    projectType: state.projectType,
    exportedAt: new Date().toISOString(),
    nodes: state.nodes,
    edges: state.edges,
    freehandStrokes: state.freehandStrokes,
    shapeStyle: state.shapeStyle,
    metadata: {
      ...state.projectMetadata,
      semanticVersion: LUMIO_PROJECT_VERSION,
    }
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
  const dataUri = pdf.output('datauristring');
  const base64 = dataUri.split(',')[1];
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
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
