import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import { useCanvasStore } from '../store/canvasStore';
import { exportPNG, exportSVG, showToast } from '../utils/exportUtils';
import { useFileIO } from './useFileIO';

export const useExport = () => {
  const state = useCanvasStore();
  const { saveProject, loadProject } = useFileIO();

  const exportAsSVG = async () => {
    try {
      const bytes = await exportSVG();
      const path = await save({
        defaultPath: `vibeplan-${Date.now()}.svg`,
        filters: [{ name: 'SVG File', extensions: ['svg'] }]
      });

      if (!path || Array.isArray(path)) return;
      await writeFile(path, bytes);
      showToast('SVG export saved', 'success');
    } catch (err) {
      console.error('Failed to save SVG:', err);
      showToast('SVG export failed', 'error');
    }
  };

  const handlePNGExport = async () => {
    try {
      const binary = await exportPNG();
      const path = await save({
        defaultPath: `vibeplan-${Date.now()}.png`,
        filters: [{ name: 'PNG Image', extensions: ['png'] }]
      });

      if (!path || Array.isArray(path)) return;
      await writeFile(path, binary);
      showToast('PNG export saved', 'success');
    } catch (err) {
      console.error('Failed to save PNG:', err);
      showToast('PNG export failed', 'error');
    }
  };

  const exportAsJSON = async () => {
    await saveProject(state.projectName);
  };

  const importProject = async () => {
    await loadProject();
  };

  return { exportAsSVG, handlePNGExport, exportAsJSON, importProject };
};
