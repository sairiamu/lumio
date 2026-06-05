import { useReactFlow } from '@xyflow/react';
import { save, open } from '@tauri-apps/plugin-dialog';
import { writeFile, readTextFile } from '@tauri-apps/plugin-fs';
import { toPng } from 'html-to-image';
import { useCanvasStore } from '../store/canvasStore';

export const useExport = () => {
  const reactFlowInstance = useReactFlow();
  const state = useCanvasStore();

  const exportAsSVG = async () => {
    const nodes = reactFlowInstance.getNodes();
    if (nodes.length === 0) return;

    const rfSvg = document.querySelector('.react-flow__svg') as SVGElement;
    if (!rfSvg) return;

    // Basic bounding box calculation
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(node => {
      const x = node.position.x;
      const y = node.position.y;
      const w = node.measured?.width || 150;
      const h = node.measured?.height || 100;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x + w > maxX) maxX = x + w;
      if (y + h > maxY) maxY = y + h;
    });

    const padding = 50;
    const width = (maxX - minX) + padding * 2;
    const height = (maxY - minY) + padding * 2;

    const svgClone = rfSvg.cloneNode(true) as SVGElement;
    svgClone.setAttribute('width', width.toString());
    svgClone.setAttribute('height', height.toString());
    svgClone.setAttribute('viewBox', `${minX - padding} ${minY - padding} ${width} ${height}`);

    // Add inline styles for fonts and clay effects
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;700&family=Sora:wght@700&display=swap');

      :root {
        --void: #0F1117;
        --ash: #1C1E26;
        --graphite: #252830;
        --steel: #3A3D4A;
        --iris: #6366F1;
        --iris-light: #6366F166;
        --mint: #34D399;
        --ember: #F87171;
        --cloud: #E2E8F0;
        --fog: #94A3B8;
        --clay-blue: #7EB8F7;
        --clay-purple: #B48EF7;
        --clay-green: #6EDBB4;
        --clay-peach: #F7A97E;
        --clay-pink: #F78EBF;
      }

      .clay-shape {
        filter: drop-shadow(6px 6px 0px rgba(0,0,0,0.25));
      }

      .react-flow__node {
        background: inherit;
        color: inherit;
      }
    `;
    svgClone.insertBefore(style, svgClone.firstChild);

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);

    try {
      const path = await save({
        filters: [{ name: 'SVG Image', extensions: ['svg'] }],
        defaultPath: `vibeplan-${Date.now()}.svg`
      });

      if (path) {
        await writeFile(path, new TextEncoder().encode(svgString));
      }
    } catch (err) {
      console.error('Failed to save SVG:', err);
    }
  };

  const exportAsPNG = async () => {
    // Target the wrapper that contains both ReactFlow and FreehandCanvas
    const rfElement = document.querySelector('.react-flow').parentElement as HTMLElement;
    if (!rfElement) return;

    try {
      const dataUrl = await toPng(rfElement, {
        pixelRatio: 2,
        backgroundColor: '#1C1E26',
        style: {
          transform: 'none',
        }
      });

      const path = await save({
        filters: [{ name: 'PNG Image', extensions: ['png'] }],
        defaultPath: `vibeplan-${Date.now()}.png`
      });

      if (path) {
        // More robust base64 to Uint8Array conversion for Tauri
        const base64Data = dataUrl.split(',')[1];
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        await writeFile(path, bytes);
      }
    } catch (err) {
      console.error('Failed to save PNG:', err);
    }
  };

  const exportAsJSON = async () => {
    const projectData = {
      nodes: state.nodes,
      edges: state.edges,
      freehandStrokes: state.freehandStrokes,
      shapeStyle: state.shapeStyle,
      version: '1.0',
      timestamp: new Date().toISOString()
    };

    const jsonString = JSON.stringify(projectData, null, 2);

    try {
      const path = await save({
        filters: [{ name: 'VibePlan Project', extensions: ['vibeplan.json', 'json'] }],
        defaultPath: `vibeplan-${Date.now()}.vibeplan.json`
      });

      if (path) {
        await writeFile(path, new TextEncoder().encode(jsonString));
      }
    } catch (err) {
      console.error('Failed to save JSON:', err);
    }
  };

  const importProject = async () => {
    try {
      const path = await open({
        multiple: false,
        filters: [{ name: 'VibePlan Project', extensions: ['vibeplan.json', 'json'] }]
      });

      if (path && !Array.isArray(path)) {
        const content = await readTextFile(path);
        const data = JSON.parse(content);

        if (data.nodes) state.setNodes(data.nodes);
        if (data.edges) state.setEdges(data.edges);
        if (data.freehandStrokes) state.setFreehandStrokes(data.freehandStrokes);
        if (data.shapeStyle) state.setShapeStyle(data.shapeStyle);

        state.setExportModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to import JSON:', err);
    }
  };

  return { exportAsSVG, exportAsPNG, exportAsJSON, importProject };
};
