import { save, open } from '@tauri-apps/plugin-dialog';
import { writeFile, readFile } from '@tauri-apps/plugin-fs';
import { useCanvasStore } from '../store/canvasStore';
import { buildProjectJSON, showToast } from '../utils/exportUtils';
import { getDefaultSavePath, ensureProjectsDir } from '../utils/projectDir';

export const useFileIO = () => {
  const store = useCanvasStore();

  const saveProject = async (projectName: string): Promise<boolean> => {
    try {
      const defaultPath = await getDefaultSavePath(projectName);
      const path = await save({
        defaultPath,
        filters: [{ name: 'VibePlan Project', extensions: ['json'] }]
      });

      if (!path || Array.isArray(path)) return false;

      const jsonString = buildProjectJSON();
      await writeFile(path, new TextEncoder().encode(jsonString));

      const name = path.split(/[\\/]/).pop()?.replace('.vibeplan.json', '') || projectName;
      store.setProjectName(name);
      store.setProjectPath(path);
      store.setIsDirty(false);
      store.addRecentProject(path);
      showToast('Project saved successfully', 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to save project:', err);
      showToast(`Save failed: ${err.message || err}`, 'error');
      return false;
    }
  };

  const loadProject = async (directPath?: string): Promise<boolean> => {
    try {
      let path: string | null = directPath || null;

      if (!path) {
        const projectsPath = await ensureProjectsDir();
        const selected = await open({
          defaultPath: projectsPath,
          filters: [{ name: 'VibePlan Project', extensions: ['json'] }],
          multiple: false
        });
        if (!selected || Array.isArray(selected)) return false;
        path = selected;
      }

      const bytes = await readFile(path);
      const json = JSON.parse(new TextDecoder().decode(bytes));

      store.setNodes(json.nodes ?? []);
      store.setEdges(json.edges ?? []);
      if (json.freehandStrokes) store.setFreehandStrokes(json.freehandStrokes);
      if (json.shapeStyle) store.setShapeStyle(json.shapeStyle);

      const name = path.split(/[\\/]/).pop()?.replace('.vibeplan.json', '') || 'Project';
      store.setProjectName(name);
      store.setProjectPath(path);
      store.setIsDirty(false);
      store.addRecentProject(path);

      // If we have a modal open, close it
      store.setExportModalOpen(false);
      showToast('Project loaded successfully', 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to load project:', err);
      showToast(`Load failed: ${err.message || err}`, 'error');
      return false;
    }
  };

  return { saveProject, loadProject };
};
