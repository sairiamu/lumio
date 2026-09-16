import React from 'react';
import * as Lucide from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { validateProject } from '../../utils/semanticValidation';

export const ArchitectureValidationPanel: React.FC = () => {
  const {
    isArchitectureValidationModalOpen,
    setArchitectureValidationModalOpen,
    activeValidationResult,
    setActiveValidationResult,
    nodes,
    edges,
    setSelectedNodeIds,
    setSelectedEdgeIds
  } = useCanvasStore();

  if (!isArchitectureValidationModalOpen) return null;

  const handleRunValidation = () => {
    const result = validateProject(nodes, edges);
    setActiveValidationResult(result);
  };

  const currentResult = activeValidationResult || validateProject(nodes, edges);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'bg-red-500/10 border-red-500/30 text-red-400', icon: <Lucide.AlertOctagon size={14} className="text-red-400" /> };
      case 'error':
        return { bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400', icon: <Lucide.AlertCircle size={14} className="text-orange-400" /> };
      case 'warning':
        return { bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400', icon: <Lucide.AlertTriangle size={14} className="text-yellow-400" /> };
      default:
        return { bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400', icon: <Lucide.Info size={14} className="text-blue-400" /> };
    }
  };

  const handleIssueClick = (issue: any) => {
    if (issue.affectedNodeIds && issue.affectedNodeIds.length > 0) {
      setSelectedNodeIds(issue.affectedNodeIds);
    } else {
      setSelectedNodeIds([]);
    }

    if (issue.affectedEdgeIds && issue.affectedEdgeIds.length > 0) {
      setSelectedEdgeIds(issue.affectedEdgeIds);
    } else {
      setSelectedEdgeIds([]);
    }
  };

  return (
    <div className="fixed right-4 top-24 w-[340px] max-h-[calc(100vh-140px)] z-50 glass-panel flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200 shadow-2xl border border-white/10 rounded-2xl bg-graphite/90 backdrop-blur-2xl text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
            <Lucide.ShieldCheck size={16} />
          </div>
          <h2 className="text-white font-black text-[11px] tracking-[0.2em] uppercase">Architecture Guard</h2>
        </div>
        <button
          onClick={() => setArchitectureValidationModalOpen(false)}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Close panel"
        >
          <Lucide.X size={16} />
        </button>
      </div>

      {/* Metrics Summary */}
      <div className="p-4 bg-black/10 border-b border-white/5 grid grid-cols-4 gap-2 text-center">
        <div className="p-2 rounded-xl bg-red-500/5 border border-red-500/10">
          <p className="text-[14px] font-black text-red-400">{currentResult.summary.criticals}</p>
          <p className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Crit</p>
        </div>
        <div className="p-2 rounded-xl bg-orange-500/5 border border-orange-500/10">
          <p className="text-[14px] font-black text-orange-400">{currentResult.summary.errors}</p>
          <p className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Err</p>
        </div>
        <div className="p-2 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
          <p className="text-[14px] font-black text-yellow-400">{currentResult.summary.warnings}</p>
          <p className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Warn</p>
        </div>
        <div className="p-2 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <p className="text-[14px] font-black text-blue-400">{currentResult.summary.infos}</p>
          <p className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Info</p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-3 bg-white/5 border-b border-white/10">
        <button
          onClick={handleRunValidation}
          className="w-full py-2 px-4 rounded-xl bg-accent hover:bg-accent-light text-white text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
        >
          <Lucide.RefreshCw size={12} className="animate-spin-slow" />
          Re-Scan Architecture
        </button>
      </div>

      {/* Issues Queue */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3 bg-black/5 max-h-[400px]">
        {currentResult.issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 opacity-60">
            <Lucide.CheckCircle size={32} className="text-emerald-400 mb-3 opacity-90" />
            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Compliant Stack</p>
            <p className="text-[10px] text-center mt-1 px-4 leading-relaxed">No architecture rule or policy violations detected.</p>
          </div>
        ) : (
          currentResult.issues.map((issue: any, index: number) => {
            const styles = getSeverityStyles(issue.severity);
            return (
              <div
                key={index}
                onClick={() => handleIssueClick(issue)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:bg-white/5 active:scale-[0.99] flex flex-col gap-1.5 ${styles.bg}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-[11px]">
                    {styles.icon}
                    <span>{issue.title}</span>
                  </div>
                  <span className="text-[8px] opacity-40 font-mono tracking-tight">{issue.ruleId}</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-normal">{issue.message}</p>
                {issue.remediation && (
                  <div className="mt-1 pt-1.5 border-t border-white/5 flex flex-col gap-0.5">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <Lucide.Wrench size={10} /> Recommendation
                    </span>
                    <p className="text-[9px] text-slate-400 leading-relaxed italic">{issue.remediation}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
