import React, { useState, useEffect } from 'react';
import { X, Layout, Trash2, Server, GitBranch, Database, GraduationCap, Columns, Star, LucideIcon } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { BUILT_IN_TEMPLATES, Template } from '../../data/templates';
import { useReactFlow } from '@xyflow/react';

const IconMap: Record<string, LucideIcon> = {
  Server,
  GitBranch,
  Database,
  GraduationCap,
  Columns,
  Star
};

export const TemplateModal: React.FC = () => {
  const {
    isTemplateModalOpen,
    setTemplateModalOpen,
    nodes,
    edges,
    setNodes,
    setEdges,
    isDirty,
    setProjectName,
    customTemplates,
    deleteCustomTemplate,
    setIsDirty
  } = useCanvasStore();

  const { fitView } = useReactFlow();
  const [activeCategory, setActiveCategory] = useState('All');

  // Handle first launch
  useEffect(() => {
    const launched = localStorage.getItem('vibeplan-launched');
    if (!launched) {
      setTemplateModalOpen(true);
      localStorage.setItem('vibeplan-launched', 'true');
    }
  }, [setTemplateModalOpen]);

  if (!isTemplateModalOpen) return null;

  const categories = ['All', 'Architecture', 'Flow', 'Data', 'Education', 'Custom'];

  const allTemplates = [...BUILT_IN_TEMPLATES, ...customTemplates];
  const filteredTemplates = activeCategory === 'All'
    ? allTemplates
    : allTemplates.filter(t => t.category === (activeCategory === 'Custom' ? 'Custom' : activeCategory));

  // Custom filter logic for custom category since category might be anything in custom ones
  const displayedTemplates = activeCategory === 'Custom'
    ? customTemplates
    : activeCategory === 'All'
      ? allTemplates
      : BUILT_IN_TEMPLATES.filter(t => t.category === activeCategory);

  const handleUseTemplate = (template: Template) => {
    if ((nodes.length > 0 || edges.length > 0) && isDirty) {
      if (!window.confirm('Replace current canvas? All unsaved changes will be lost.')) {
        return;
      }
    }

    setNodes(template.nodes);
    setEdges(template.edges);
    setProjectName(template.name);
    setIsDirty(false);
    setTemplateModalOpen(false);

    setTimeout(() => {
      fitView({ duration: 800 });
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-4xl max-h-[80vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-border">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <Layout className="w-5 h-5 text-accent" />
            <h2 className="font-sora font-semibold text-lg text-text">Starter Templates</h2>
          </div>
          <button
            onClick={() => setTemplateModalOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-border p-4 flex flex-col gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  activeCategory === cat
                    ? 'bg-accent text-white font-medium shadow-lg shadow-accent/20'
                    : 'text-text-muted hover:bg-white/5 hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-black/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedTemplates.map(template => {
                const IconComponent = IconMap[template.thumbnail] || Star;
                return (
                  <div
                    key={template.id}
                    className="group relative glass-panel bg-white/5 border-border hover:border-accent/50 transition-all duration-300 rounded-xl p-4 flex flex-col items-center text-center cursor-default"
                  >
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 text-accent">
                      <IconComponent size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-text mb-1 truncate w-full px-2">{template.name}</h3>
                    <p className="text-xs text-text-muted line-clamp-2 mb-4 h-8">
                      {template.description}
                    </p>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="bg-accent text-white px-4 py-2 rounded-lg font-bold text-sm shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      >
                        Use Template
                      </button>

                      {customTemplates.some(ct => ct.id === template.id) && (
                         <button
                         onClick={(e) => {
                           e.stopPropagation();
                           deleteCustomTemplate(template.id);
                         }}
                         className="absolute top-2 right-2 p-1.5 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-md transition-all"
                         title="Delete Template"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {displayedTemplates.length === 0 && (
                <div className="col-span-full py-12 text-center text-text-muted">
                  No templates found in this category.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer for Custom Templates */}
        <div className="px-6 py-4 border-t border-border flex justify-end bg-white/5">
          <button
            onClick={() => {
              const name = window.prompt('Enter template name:');
              if (name) {
                const { nodes, edges } = useCanvasStore.getState();
                const newTemplate: Template = {
                  id: `custom_${Date.now()}`,
                  name,
                  description: 'Custom user template',
                  category: 'Custom',
                  thumbnail: 'Star',
                  nodes: JSON.parse(JSON.stringify(nodes)),
                  edges: JSON.parse(JSON.stringify(edges)),
                };
                useCanvasStore.getState().addCustomTemplate(newTemplate);
              }
            }}
            className="text-xs font-medium text-accent hover:underline"
          >
            + Save current as template
          </button>
        </div>
      </div>
    </div>
  );
};
