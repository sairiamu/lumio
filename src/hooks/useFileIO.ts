import { save, open } from '@tauri-apps/plugin-dialog';
import { writeFile, readFile } from '@tauri-apps/plugin-fs';
import { useCanvasStore } from '../store/canvasStore';
import { buildProjectJSON, showToast, migrateProject } from '../utils/exportUtils';
import { getDefaultSavePath, ensureProjectsDir } from '../utils/projectDir';

export const useFileIO = () => {
  const store = useCanvasStore();

  const saveProject = async (projectName: string): Promise<boolean> => {
    try {
      const defaultPath = await getDefaultSavePath(projectName);
      const path = await save({
        defaultPath,
        filters: [{ name: 'Lumio Project', extensions: ['json'] }]
      });

      if (!path || Array.isArray(path)) return false;

      const jsonString = buildProjectJSON();
      await writeFile(path, new TextEncoder().encode(jsonString));

      const name = path.split(/[\\/]/).pop()?.replace('.lumio.json', '') || projectName;
      store.setProjectName(name);
      store.setProjectPath(path);
      store.setIsDirty(false);
      store.addRecentProject(path);
      showToast('Project saved successfully', 'success');
      return true;
    } catch (err: unknown) {
      console.error('Failed to save project:', err);
      showToast(`Save failed: ${err instanceof Error ? err.message : String(err)}`, 'error');
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
          filters: [{ name: 'Lumio Project', extensions: ['json'] }],
          multiple: false
        });
        if (!selected || Array.isArray(selected)) return false;
        path = selected;
      }

      const bytes = await readFile(path);
      const rawJson = JSON.parse(new TextDecoder().decode(bytes));
      const json = migrateProject(rawJson);

      // Perform optional fast validation upon load
      const { validateProject } = await import('../utils/semanticValidation');
      const validation = validateProject(json.nodes ?? [], json.edges ?? []);
      store.setActiveValidationResult(validation);

      store.setNodes(json.nodes ?? []);
      store.setEdges(json.edges ?? []);
      store.setProjectType(json.projectType ?? 'elemental-sketch');
      if (json.freehandStrokes) store.setFreehandStrokes(json.freehandStrokes);
      if (json.shapeStyle) store.setShapeStyle(json.shapeStyle);
      if (json.metadata) store.setProjectMetadata(json.metadata);

      const name = path.split(/[\\/]/).pop()?.replace('.lumio.json', '') || 'Project';
      store.setProjectName(name);
      store.setProjectPath(path);
      store.setIsDirty(false);
      store.addRecentProject(path);

      // If we have a modal open, close it
      store.setExportModalOpen(false);
      showToast('Project loaded successfully', 'success');
      return true;
    } catch (err: unknown) {
      console.error('Failed to load project:', err);
      showToast(`Load failed: ${err instanceof Error ? err.message : String(err)}`, 'error');
      return false;
    }
  };

  return { saveProject, loadProject };
};
