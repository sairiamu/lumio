import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { getCatalogItem } from '../../data/architectureCatalog';
import { Cpu } from 'lucide-react';

export const DynamicCatalogProperties: React.FC = () => {
  const { nodes, selectedNodeIds, updateNodeData } = useCanvasStore();
  const selectedNode = nodes.find((n) => selectedNodeIds.includes(n.id));

  if (!selectedNode || !selectedNode.data.catalogId) return null;

  const catalogItem = getCatalogItem(selectedNode.data.catalogId);
  if (!catalogItem || !catalogItem.properties || catalogItem.properties.length === 0) return null;

  const currentParameters = (selectedNode.data.parameters as { key: string; value: string }[]) || [];

  const handlePropertyChange = (key: string, value: string) => {
    const updatedParameters = [...currentParameters];
    const paramIndex = updatedParameters.findIndex((p) => p.key === key);

    if (paramIndex !== -1) {
      updatedParameters[paramIndex] = { key, value };
    } else {
      updatedParameters.push({ key, value });
    }

    updateNodeData(selectedNode.id, {
      parameters: updatedParameters,
    });
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
          <Cpu size={14} />
        </div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text">
          Technical Parameters
        </h3>
      </div>

      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 shadow-inner backdrop-blur-sm">
        <div className="flex flex-col gap-3">
          {catalogItem.properties.map((prop) => {
            const currentParam = currentParameters.find((p) => p.key === prop.key);
            const currentValue = currentParam ? currentParam.value : String(prop.defaultValue ?? '');

            return (
              <div key={prop.key} className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted/60">
                  {prop.label}
                </label>

                {prop.type === 'select' ? (
                  <select
                    value={currentValue}
                    onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                    className="w-full bg-void/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-text outline-none focus:border-accent/40 transition-colors"
                  >
                    {prop.options?.map((opt) => (
                      <option key={opt} value={opt} className="bg-graphite text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : prop.type === 'boolean' ? (
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id={`prop-${prop.key}`}
                      checked={currentValue === 'true'}
                      onChange={(e) => handlePropertyChange(prop.key, String(e.target.checked))}
                      className="w-3.5 h-3.5 rounded bg-void/40 border border-white/10 text-accent focus:ring-0 focus:ring-offset-0"
                    />
                    <label htmlFor={`prop-${prop.key}`} className="text-[11px] text-text-muted select-none cursor-pointer">
                      {prop.description || 'Enable capability'}
                    </label>
                  </div>
                ) : (
                  <input
                    type={prop.type === 'number' ? 'number' : 'text'}
                    value={currentValue}
                    onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                    placeholder={prop.description || prop.label}
                    className="w-full bg-void/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-text outline-none focus:border-accent/40 transition-colors placeholder:text-text-muted/30"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
