import React, { useState, useEffect, useRef } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { renderLumioMarkdown } from '../../utils/lumioMarkdown';
import {
  X, Maximize2, Minimize2, Save, Type, Bold, Italic,
  List, Hash, Quote, Code, Image as ImageIcon, Minus,
  Highlighter, Smile, Check, Edit3, Trash2
} from 'lucide-react';

interface ExpandedNodeProps {
  nodeId: string;
}

export const ExpandedNode: React.FC<ExpandedNodeProps> = ({ nodeId }) => {
  const { nodes, updateNodeData, setExpandedNodeId } = useCanvasStore();
  const node = nodes.find(n => n.id === nodeId);

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(node?.data.content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (node) {
      setContent(node.data.content || '');
    }
  }, [node?.data.content]);

  if (!node) return null;

  const handleClose = () => {
    setExpandedNodeId(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    updateNodeData(nodeId, { content });
    setIsEditing(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (isEditing) {
        setIsEditing(false);
        setContent(node.data.content || '');
      } else {
        handleClose();
      }
    }
  };

  const insertSyntax = (syntax: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newContent = before + syntax + after;
    setContent(newContent);

    setTimeout(() => {
      textareaRef.current?.focus();
      const newPos = start + syntax.length;
      textareaRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-void/60 backdrop-blur-md p-8 animate-in fade-in zoom-in-95 duration-300"
      onClick={handleClose}
    >
      <div
        className="glass-panel w-full max-w-[850px] h-[650px] flex flex-col overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)] border-2 border-accent transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-void/30">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full shadow-[0_0_10px_var(--accent)]"
              style={{ backgroundColor: node.data.clayColor || 'var(--accent)' }}
            />
            <h3 className="font-sora font-semibold text-text">{node.data.title || 'Untitled Node'}</h3>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-accent/20 border border-white/10"
              >
                <Check size={14} /> Finish Editing
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-text px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-border"
              >
                <Edit3 size={14} /> Edit Content
              </button>
            )}
            <div className="w-px h-6 bg-border mx-1" />
            <button
              onClick={handleClose}
              className="text-text-muted hover:text-text p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Editor Toolbar */}
        {isEditing && (
          <div className="flex justify-center py-3 bg-void/40 border-b border-border">
            <div className="flex items-center gap-0.5 px-3 py-1.5 bg-graphite/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
              <ToolbarButton icon={<Hash size={16} />} label="H1" onClick={() => insertSyntax('# ')} />
              <ToolbarButton icon={<Hash size={14} />} label="H2" onClick={() => insertSyntax('## ')} />
              <div className="w-px h-4 bg-white/10 mx-1.5" />
              <ToolbarButton icon={<Bold size={16} />} onClick={() => insertSyntax('**bold**')} />
              <ToolbarButton icon={<Italic size={16} />} onClick={() => insertSyntax('*italic*')} />
              <ToolbarButton icon={<Highlighter size={16} />} onClick={() => insertSyntax('==highlight==')} />
              <div className="w-px h-4 bg-white/10 mx-1.5" />
              <ToolbarButton icon={<List size={16} />} onClick={() => insertSyntax('- ')} />
              <ToolbarButton icon={<Quote size={16} />} onClick={() => insertSyntax('> ')} />
              <ToolbarButton icon={<Code size={16} />} onClick={() => insertSyntax('`code`')} />
              <ToolbarButton icon={<Minus size={16} />} onClick={() => insertSyntax('\n---\n')} />
              <div className="w-px h-4 bg-white/10 mx-1.5" />
              <ToolbarButton icon={<ImageIcon size={16} />} onClick={() => insertSyntax('[img:https://]')} />
              <ToolbarButton icon={<Smile size={16} />} onClick={() => insertSyntax('[icon:Box]')} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {isEditing ? (
            <div className="flex-1 flex overflow-hidden divide-x divide-border">
              <textarea
                ref={textareaRef}
                autoFocus
                className="flex-1 bg-void/50 p-6 text-text font-mono text-sm resize-none outline-none custom-scrollbar placeholder:opacity-30"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type Lumio Markdown here..."
              />
              <div className="flex-1 bg-canvas/30 p-8 overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto">
                  {renderLumioMarkdown(content)}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-canvas p-10 overflow-y-auto custom-scrollbar">
               <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                 {renderLumioMarkdown(content)}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: React.ReactNode; label?: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/10 rounded-md text-text-muted hover:text-text transition-colors whitespace-nowrap"
  >
    {icon}
    {label && <span className="text-[10px] font-bold tracking-tight uppercase">{label}</span>}
  </button>
);
