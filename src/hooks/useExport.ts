import { save, open } from '@tauri-apps/plugin-dialog';
import { writeFile, readFile } from '@tauri-apps/plugin-fs';
import { useCanvasStore } from '../store/canvasStore';
import { buildProjectJSON, exportPNG, exportSVG, showToast } from '../utils/exportUtils';

export const useExport = () => {
  const state = useCanvasStore();

  const exportAsSVG = async () => {
    try {
      const svgString = await exportSVG();
      const path = await save({
        defaultPath: `vibeplan-${Date.now()}.svg`,
        filters: [{ name: 'SVG File', extensions: ['svg'] }]
      });

      if (!path || Array.isArray(path)) return;
      await writeFile(path, new TextEncoder().encode(svgString));
      showToast('SVG export saved', 'success');
    } catch (err) {
      console.error('Failed to save SVG:', err);
      showToast('SVG export failed', 'error');
    }
  };

  const exportAsPNG = async () => {
    try {
      const bytes = await exportPNG();
      const path = await save({
        defaultPath: `vibeplan-${Date.now()}.png`,
        filters: [{ name: 'PNG Image', extensions: ['png'] }]
      });

      if (!path || Array.isArray(path)) return;
      await writeFile(path, bytes);
      showToast('PNG export saved', 'success');
    } catch (err) {
      console.error('Failed to save PNG:', err);
      showToast('PNG export failed', 'error');
    }
  };

  const exportAsJSON = async () => {
    try {
      const jsonString = buildProjectJSON();
      const bytes = new TextEncoder().encode(jsonString);
      const path = await save({
        defaultPath: `vibeplan-${Date.now()}.vibeplan.json`,
        filters: [{ name: 'VibePlan Project', extensions: ['json'] }]
      });

      if (!path || Array.isArray(path)) return;
      await writeFile(path, bytes);
      showToast('Project saved as JSON', 'success');
    } catch (err) {
      console.error('Failed to save JSON:', err);
      showToast('JSON export failed', 'error');
    }
  };

  const importProject = async () => {
    try {
      const path = await open({
        multiple: false,
        filters: [{ name: 'VibePlan Project', extensions: ['json'] }]
      });

      if (!path || Array.isArray(path)) return;

      const bytes = await readFile(path as string);
      const jsonString = new TextDecoder().decode(bytes as Uint8Array);
      const project = JSON.parse(jsonString);

      if (project.nodes) state.setNodes(project.nodes);
      if (project.edges) state.setEdges(project.edges);
      if (project.freehandStrokes) state.setFreehandStrokes(project.freehandStrokes);
      if (project.shapeStyle) state.setShapeStyle(project.shapeStyle);

      state.setExportModalOpen(false);
      showToast('Project loaded successfully', 'success');
    } catch (err) {
      console.error('Failed to import JSON:', err);
      showToast('JSON import failed', 'error');
    }
  };

  return { exportAsSVG, exportAsPNG, exportAsJSON, importProject };
};
