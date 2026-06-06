import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { NodeProps, Node, Handle, Position, NodeResizer } from '@xyflow/react';
import { createPortal } from 'react-dom';
import * as LucideIcons from 'lucide-react';
import {
  FileUp, Search, X, Check, Database, Server, Cloud, User, Shield, Globe, Code,
  Smartphone, Laptop, Wifi, Lock, Key, Bell, Mail, FileText, Folder, Settings,
  Zap, Heart, Star, CheckCircle, AlertCircle, Info, HelpCircle, HardDrive, Cpu,
  Network, Share2, Layers, Layout, Grid, Image, Music, Video, Camera, MapPin,
  Navigation, Terminal, Box, Package, Activity, BarChart2, PieChart, TrendingUp,
  Filter, Plus, Minus, Edit, Trash
} from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { NodeData } from '../../types';
import { renderLumioMarkdown } from '../../utils/lumioMarkdown';
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { useTrackedRelations } from '../../hooks/useTrackedRelations';

const COMMON_ICONS = [
  'Database', 'Server', 'Cloud', 'User', 'Shield', 'Globe', 'Code', 'Smartphone', 'Laptop', 'Wifi',
  'Lock', 'Key', 'Bell', 'Mail', 'FileText', 'Folder', 'Settings', 'Zap', 'Heart', 'Star',
  'CheckCircle', 'AlertCircle', 'Info', 'HelpCircle', 'HardDrive', 'Cpu', 'Network', 'Share2', 'Layers', 'Layout',
  'Grid', 'Image', 'Music', 'Video', 'Camera', 'MapPin', 'Navigation', 'Terminal', 'Box', 'Package',
  'Activity', 'BarChart2', 'PieChart', 'TrendingUp', 'Filter', 'Search', 'Plus', 'Minus', 'Edit', 'Trash'
];

export const CardNode: React.FC<NodeProps<Node<NodeData>>> = (props) => {
  const { id, data, selected } = props;
  const {
    updateNodeData,
    expandedNodeId,
    setExpandedNodeId,
    isPresentationMode,
    currentStep,
    stepNodes,
    searchQuery,
    searchResults,
    pushHistory
  } = useCanvasStore();

  const { glowNodeIds, trackedNodeId } = useTrackedRelations();

  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState<NodeData>(data);
  const [iconSearch, setIconSearch] = useState('');

  const isExpanded = data.viewMode === 'expanded' || expandedNodeId === id;
  const cardMode = data.cardMode || 'simple';

  // Sync local data with props when not editing
  useEffect(() => {
    if (!isEditing) {
      setLocalData(data);
    }
  }, [data, isEditing]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    pushHistory();
    setIsEditing(false);
    updateNodeData(id, localData);
  }, [id, localData, updateNodeData, pushHistory]);

  const handleToggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExpanded) {
      setExpandedNodeId(null);
      updateNodeData(id, { viewMode: 'compact' });
    } else {
      setExpandedNodeId(id);
      updateNodeData(id, { viewMode: 'expanded' });
    }
  }, [id, isExpanded, setExpandedNodeId, updateNodeData]);

  const handleImportFile = async () => {
    try {
      const file = await open({
        multiple: false,
        filters: [{
          name: 'Text/Markdown',
          extensions: ['txt', 'md', 'markdown']
        }]
      });

      if (file && typeof file === 'string') {
        const content = await readTextFile(file);
        let title = '';

        // Auto-detect title
        const h1Match = content.match(/^#\s+(.+)$/m);
        if (h1Match) {
          title = h1Match[1];
        } else {
          // get filename from path
          const filename = file.split(/[\\/]/).pop() || '';
          title = filename.replace(/\.[^/.]+$/, "");
        }

        let processedContent = content;
        if (file.endsWith('.txt')) {
          // For .txt files — wrap content in paragraph blocks
          processedContent = content.split('\n\n').map(p => p.trim()).filter(p => p).join('\n\n');
        }

        setLocalData(prev => ({
          ...prev,
          content: processedContent,
          title: title,
          cardMode: 'document'
        }));
      }
    } catch (err) {
      console.error('File import failed:', err);
    }
  };

  const IconComponent = (LucideIcons as any)[data.cardIcon || ''] || null;
  const accentColor = data.accentColor || 'var(--accent)';

  // Style logic from BaseNode
  const isTracked = glowNodeIds.includes(id);
  const isOrigin = trackedNodeId === id;
  const stepIndex = stepNodes.indexOf(id);
  const isCurrentStep = stepIndex !== -1 && currentStep === stepIndex;
  const isMatch = searchQuery.length > 0 && searchResults.includes(id);

  let opacity = 1;
  if (isPresentationMode && currentStep !== -1 && !isCurrentStep) {
    opacity = 0.2;
  } else if (searchQuery.length > 0 && !isMatch) {
    opacity = 0.25;
  }

  // Render Compact View
  const renderCompact = () => {
    return (
      <div
        className={`w-full h-full flex flex-col rounded-lg overflow-hidden border transition-all ${selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''}`}
        style={{
          backgroundColor: 'rgba(var(--canvas-rgb), 0.8)',
          borderColor: isMatch ? 'var(--success)' : 'var(--border)',
          boxShadow: isCurrentStep
            ? '0 0 0 3px var(--accent), 0 0 32px 8px var(--accent-light)'
            : isTracked
              ? isOrigin
                ? '0 0 0 3px var(--accent), 0 0 24px 6px var(--accent-light)'
                : '0 0 0 2px var(--success), 0 0 16px 4px rgba(52,211,153,0.3)'
              : 'none',
          opacity: opacity,
          backdropFilter: 'blur(8px)'
        }}
        onDoubleClick={handleDoubleClick}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 text-white flex-shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          {cardMode !== 'document' && IconComponent && <IconComponent size={16} />}
          <span className="font-sora font-bold text-[13px] truncate flex-1">
            {data.title || 'Untitled'}
          </span>
          {isExpanded && (
            <button onClick={handleToggleExpand} className="opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-3 overflow-hidden text-text/90">
          {cardMode === 'simple' && (
            <div className="flex flex-col gap-1.5">
              {(data.parameters || []).slice(0, 4).map((p, i) => (
                <div key={i} className="flex gap-2 text-[11px] leading-tight">
                  <span className="text-accent font-bold">•</span>
                  <span className="text-text-muted font-medium shrink-0">{p.key}:</span>
                  <span className="text-text truncate">{p.value}</span>
                </div>
              ))}
              {data.description && (
                <p className="text-[11px] text-text-muted italic line-clamp-2 mt-1">
                  {data.description}
                </p>
              )}
            </div>
          )}

          {(cardMode === 'document' || cardMode === 'mixed') && (
            <div className="text-[11px] line-clamp-3 opacity-90">
              {renderLumioMarkdown(data.content || '')}
            </div>
          )}
        </div>

        <Handle type="target" position={Position.Top} className="!bg-accent border-none" />
        <Handle type="source" position={Position.Bottom} className="!bg-accent border-none" />
        <Handle type="target" position={Position.Left} className="!bg-accent border-none" />
        <Handle type="source" position={Position.Right} className="!bg-accent border-none" />
      </div>
    );
  };

  // Render Expanded View
  const renderExpanded = () => {
    return createPortal(
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-void/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => {
           setExpandedNodeId(null);
           updateNodeData(id, { viewMode: 'compact' });
        }}
      >
        <div
          className="bg-canvas border-2 border-accent rounded-xl shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden w-[90%] max-w-[720px] h-[80%] max-h-[560px] min-w-[420px] min-h-[300px] animate-in zoom-in-95 duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          onClick={e => e.stopPropagation()}
        >
          <div
            className="flex items-center gap-3 px-6 py-4 text-white sticky top-0 z-10 shadow-lg"
            style={{ backgroundColor: accentColor }}
          >
            {cardMode !== 'document' && IconComponent && <IconComponent size={20} />}
            <h2 className="font-sora font-bold text-lg flex-1 truncate">{data.title || 'Untitled'}</h2>
            <button
              onClick={() => {
                setExpandedNodeId(null);
                updateNodeData(id, { viewMode: 'compact' });
              }}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-[20px] custom-scrollbar bg-canvas/80">
            <div className="max-w-2xl mx-auto">
              {renderLumioMarkdown(data.content || '')}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Render Editor
  const renderEditor = () => {
    const filteredIcons = COMMON_ICONS.filter(name =>
      name.toLowerCase().includes(iconSearch.toLowerCase())
    );

    const activeTabClass = "border-accent text-accent";
    const inactiveTabClass = "border-transparent text-text-muted hover:text-text";

    return (
      <div
        className="absolute z-[100] bg-panel border-2 border-accent rounded-lg flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{
          width: '400px',
          height: '500px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && e.ctrlKey) handleCloseEdit();
          if (e.key === 'Escape') setIsEditing(false);
        }}
      >
        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-border bg-void/40">
          {(['simple', 'document', 'mixed'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => {
                pushHistory();
                setLocalData(prev => ({ ...prev, cardMode: mode }));
              }}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                (localData.cardMode || 'simple') === mode ? activeTabClass : inactiveTabClass
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          {/* Title Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-text-muted flex justify-between">
              Title
              <span className="opacity-50 font-normal">Ctrl+Enter to save</span>
            </label>
            <input
              autoFocus
              className="bg-void/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
              value={localData.title}
              onChange={e => setLocalData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter card title..."
            />
          </div>

          {/* Icon Selector (Simple/Mixed) */}
          {(localData.cardMode === 'simple' || localData.cardMode === 'mixed') && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-text-muted flex justify-between items-center">
                Icon Selector
                <div className="relative w-32">
                  <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    className="w-full bg-void/50 border border-border rounded-full pl-6 pr-2 py-1 text-[10px] outline-none focus:border-accent"
                    placeholder="Filter icons..."
                    value={iconSearch}
                    onChange={e => setIconSearch(e.target.value)}
                  />
                </div>
              </label>
              <div className="grid grid-cols-6 gap-1 h-32 overflow-y-auto bg-void/30 p-2 rounded-lg border border-border custom-scrollbar">
                {filteredIcons.map(name => {
                  const Icon = (LucideIcons as any)[name];
                  if (!Icon) return null;
                  return (
                    <button
                      key={name}
                      onClick={() => setLocalData(prev => ({ ...prev, cardIcon: name }))}
                      className={`p-2 rounded-md transition-all flex items-center justify-center ${
                        localData.cardIcon === name ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'hover:bg-white/10 text-text-muted'
                      }`}
                      title={name}
                    >
                      <Icon size={16} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Markdown Content (Document/Mixed) */}
          {(localData.cardMode === 'document' || localData.cardMode === 'mixed') && (
            <div className="flex flex-col gap-2 flex-1 min-h-[160px]">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold text-text-muted">Lumio Markdown</label>
                <button
                  onClick={handleImportFile}
                  className="flex items-center gap-1.5 px-2 py-1 bg-accent/10 hover:bg-accent/20 text-[10px] font-bold text-accent rounded transition-colors"
                >
                  <FileUp size={12} /> Import File
                </button>
              </div>
              <textarea
                className="flex-1 bg-void/50 border border-border rounded-lg p-3 text-[12px] font-mono outline-none focus:border-accent resize-none custom-scrollbar leading-relaxed"
                value={localData.content}
                onChange={e => setLocalData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Type Lumio Markdown here... Supports # Headers, - Lists, **Bold**, etc."
              />
            </div>
          )}

          {/* Parameters (Simple) */}
          {(localData.cardMode === 'simple' || !localData.cardMode) && (
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase font-bold text-text-muted">Parameters</label>
              <div className="flex flex-col gap-1.5">
                {(localData.parameters || []).map((p, i) => (
                  <div key={i} className="flex gap-1.5 items-center">
                    <input
                      className="w-1/3 bg-void/50 border border-border rounded-md px-2 py-1.5 text-[11px] outline-none focus:border-accent"
                      value={p.key}
                      onChange={e => {
                        const newParams = [...(localData.parameters || [])];
                        newParams[i] = { ...p, key: e.target.value };
                        setLocalData(prev => ({ ...prev, parameters: newParams }));
                      }}
                      placeholder="Key"
                    />
                    <input
                      className="flex-1 bg-void/50 border border-border rounded-md px-2 py-1.5 text-[11px] outline-none focus:border-accent"
                      value={p.value}
                      onChange={e => {
                        const newParams = [...(localData.parameters || [])];
                        newParams[i] = { ...p, value: e.target.value };
                        setLocalData(prev => ({ ...prev, parameters: newParams }));
                      }}
                      placeholder="Value"
                    />
                    <button
                      onClick={() => setLocalData(prev => ({ ...prev, parameters: (prev.parameters || []).filter((_, idx) => idx !== i) }))}
                      className="p-1 text-text-muted hover:text-error transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setLocalData(prev => ({ ...prev, parameters: [...(prev.parameters || []), { key: '', value: '' }] }))}
                  className="text-[10px] font-black text-accent flex items-center gap-1 hover:opacity-80 transition-opacity mt-1"
                >
                  <Plus size={12} /> ADD PARAMETER
                </button>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[10px] uppercase font-bold text-text-muted">Description</label>
                <textarea
                  className="bg-void/50 border border-border rounded-lg p-3 text-[11px] outline-none focus:border-accent resize-none h-20"
                  value={localData.description}
                  onChange={e => setLocalData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional brief description..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border flex justify-end gap-2 bg-void/50 backdrop-blur-md">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-1.5 text-[11px] font-bold hover:bg-white/5 rounded-lg transition-colors text-text-muted hover:text-text"
          >
            Cancel
          </button>
          <button
            onClick={handleCloseEdit}
            className="px-4 py-1.5 bg-accent text-white text-[11px] font-bold rounded-lg shadow-lg shadow-accent/20 flex items-center gap-2 hover:brightness-110 transition-all active:scale-95"
          >
            <Check size={14} /> Save Changes
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative" style={{ width: '100%', height: '100%' }}>
      {renderCompact()}
      {isEditing && renderEditor()}
      {isExpanded && renderExpanded()}

      <NodeResizer
        isVisible={!!selected && !isExpanded && !isEditing}
        minWidth={180}
        minHeight={120}
        handleStyle={{ width: 8, height: 8, background: 'var(--accent)', border: 'none', borderRadius: '2px' }}
        lineStyle={{ border: '1px solid var(--accent)', opacity: 0.5 }}
      />
    </div>
  );
};
