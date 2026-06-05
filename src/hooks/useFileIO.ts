import { save, open } from '@tauri-apps/plugin-dialog';
import { writeFile, readFile } from '@tauri-apps/plugin-fs';
import { useCanvasStore } from '../store/canvasStore';
import { buildProjectJSON } from '../utils/exportUtils';
import { getDefaultSavePath, ensureProjectsDir } from '../utils/projectDir';

export const useFileIO = () => {
  const store = useCanvasStore();

  const saveProject = async (projectName: string): Promise<void> => {
    try {
      const defaultPath = await getDefaultSavePath(projectName);
      const path = await save({
        defaultPath,
        filters: [{ name: 'VibePlan Project', extensions: ['json'] }]
      });

      if (!path || Array.isArray(path)) return;

      const jsonString = buildProjectJSON();
      const bytes = new TextEncoder().encode(jsonString);
      await writeFile(path, bytes);

      const name = path.split(/[\\/]/).pop()?.replace('.vibeplan.json', '') || projectName;
      store.setProjectName(name);
      store.setProjectPath(path);
      store.setIsDirty(false);
      store.addRecentProject(path);
    } catch (err) {
      console.error('Failed to save project:', err);
    }
  };

  const loadProject = async (directPath?: string): Promise<void> => {
    try {
      let path: string | null = directPath || null;

      if (!path) {
        const projectsPath = await ensureProjectsDir();
        const selected = await open({
          defaultPath: projectsPath,
          filters: [{ name: 'VibePlan Project', extensions: ['json'] }],
          multiple: false
        });
        if (!selected || Array.isArray(selected)) return;
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
    } catch (err) {
      console.error('Failed to load project:', err);
    }
  };

  return { saveProject, loadProject };
};
