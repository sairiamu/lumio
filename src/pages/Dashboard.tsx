import React, { useEffect, useState } from 'react';
import { Plus, FileText, Clock, ChevronRight } from 'lucide-react';
import { readDir, stat } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';
import { ensureProjectsDir } from '../utils/projectDir';
import { useFileIO } from '../hooks/useFileIO';
import { useCanvasStore } from '../store/canvasStore';

interface ProjectInfo {
  name: string;
  path: string;
  lastModified: Date;
  type: string;
}

interface DashboardProps {
  onProjectSelected: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onProjectSelected }) => {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const { loadProject } = useFileIO();
  const {
    setProjectName,
    setNodes,
    setEdges,
    setFreehandStrokes,
    setProjectPath,
    setIsDirty,
    addToast
  } = useCanvasStore();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const dir = await ensureProjectsDir();
        const entries = await readDir(dir);

        const projectFiles = await Promise.all(
          entries
            .filter(e => e.isFile && e.name.endsWith('.lumio.json'))
            .map(async e => {
              const fullPath = await join(dir, e.name);
              const s = await stat(fullPath);

              // For now, default to Elemental Sketch as per Stage 1
              const type = 'Elemental Sketch';

              return {
                name: e.name.replace('.lumio.json', ''),
                path: fullPath,
                lastModified: s.mtime || new Date(),
                type
              };
            })
        );

        setProjects(projectFiles.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime()));
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        addToast('Failed to load projects list', 'error');
      }
    };

    fetchProjects();
  }, [addToast]);

  const handleNewProject = () => {
    // Reset store for a new project
    setProjectName('Untitled Project');
    setNodes([]);
    setEdges([]);
    setFreehandStrokes([]);
    setProjectPath(null);
    setIsDirty(false);
    onProjectSelected();
  };

  const handleOpenProject = async (path: string) => {
    const success = await loadProject(path);
    if (success) {
      onProjectSelected();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-8 overflow-y-auto">
      {/* Background glow effects */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12 relative z-10">
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">My Projects</h1>
          <p className="text-[var(--text-muted)] font-inter text-sm">Welcome back to Lumio.</p>
        </div>
        <button
          onClick={handleNewProject}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white rounded-xl font-semibold transition-all shadow-lg active:scale-95 shadow-[var(--accent)]/10"
          aria-label="New Project"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {projects.map((project) => (
          <div
            key={project.path}
            onClick={() => handleOpenProject(project.path)}
            className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-[var(--accent)]/30 hover:bg-white/[0.08] transition-all cursor-pointer group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 text-[var(--text-muted)] uppercase tracking-wider">
                {project.type}
              </span>
            </div>

            <h3 className="text-lg font-semibold mb-1 truncate">{project.name}</h3>

            <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-6">
              <Clock className="w-4 h-4" />
              <span>{project.lastModified.toLocaleDateString()}</span>
            </div>

            <div className="mt-auto flex items-center justify-between text-[var(--accent)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Open project</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-[var(--text-muted)]">
            <FileText className="w-12 h-12 mb-4 opacity-10" />
            <p className="text-lg font-medium">No projects yet</p>
            <p className="text-sm">Click "New Project" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};
