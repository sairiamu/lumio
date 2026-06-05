import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ShapeItem {
  name: string;
  iconName: string;
}

interface Category {
  name: string;
  shapes: ShapeItem[];
}

const CATEGORIES: Category[] = [
  {
    name: 'BASIC',
    shapes: [
      { name: 'Rectangle', iconName: 'Square' },
      { name: 'Circle', iconName: 'Circle' },
      { name: 'Diamond', iconName: 'Diamond' },
      { name: 'Text', iconName: 'Type' },
      { name: 'Card', iconName: 'CreditCard' },
    ],
  },
  {
    name: 'TECH & INFRASTRUCTURE',
    shapes: [
      { name: 'Database', iconName: 'Database' },
      { name: 'Server', iconName: 'Server' },
      { name: 'Cloud', iconName: 'Cloud' },
      { name: 'API', iconName: 'Code' },
      { name: 'Microservice', iconName: 'Layers' },
      { name: 'Container', iconName: 'Box' },
      { name: 'Queue', iconName: 'List' },
      { name: 'Cache', iconName: 'Zap' },
      { name: 'LoadBalancer', iconName: 'GitFork' },
      { name: 'Firewall', iconName: 'Shield' },
    ],
  },
  {
    name: 'DEVICES & INTERFACES',
    shapes: [
      { name: 'Phone', iconName: 'Smartphone' },
      { name: 'Tablet', iconName: 'Tablet' },
      { name: 'Desktop', iconName: 'Monitor' },
      { name: 'Browser', iconName: 'Globe' },
      { name: 'Terminal', iconName: 'Terminal' },
      { name: 'WebApp', iconName: 'AppWindow' },
      { name: 'MobileApp', iconName: 'Smartphone' },
      { name: 'Watch', iconName: 'Watch' },
      { name: 'TV', iconName: 'Tv' },
      { name: 'Router', iconName: 'Router' },
    ],
  },
  {
    name: 'PEOPLE & ROLES',
    shapes: [
      { name: 'User', iconName: 'User' },
      { name: 'Admin', iconName: 'UserCheck' },
      { name: 'Developer', iconName: 'UserCode' },
      { name: 'Team', iconName: 'Users' },
      { name: 'Bot', iconName: 'Bot' },
      { name: 'Customer', iconName: 'UserPlus' },
      { name: 'Manager', iconName: 'UserCog' },
      { name: 'Support', iconName: 'LifeBuoy' },
      { name: 'Guest', iconName: 'UserMinus' },
    ],
  },
  {
    name: 'DOCUMENT & DATA',
    shapes: [
      { name: 'Document', iconName: 'FileText' },
      { name: 'Spreadsheet', iconName: 'Table' },
      { name: 'Report', iconName: 'FileBarChart' },
      { name: 'Email', iconName: 'Mail' },
      { name: 'Folder', iconName: 'Folder' },
      { name: 'Archive', iconName: 'Archive' },
      { name: 'Certificate', iconName: 'Award' },
      { name: 'Book', iconName: 'BookOpen' },
      { name: 'Note', iconName: 'StickyNote' },
    ],
  },
  {
    name: 'ACTIONS & FLOW',
    shapes: [
      { name: 'Start', iconName: 'Play' },
      { name: 'End', iconName: 'Square' },
      { name: 'Decision', iconName: 'Diamond' },
      { name: 'Process', iconName: 'Activity' },
      { name: 'Loop', iconName: 'Repeat' },
      { name: 'Merge', iconName: 'GitMerge' },
      { name: 'Split', iconName: 'GitSplit' },
      { name: 'Delay', iconName: 'Clock' },
      { name: 'Trigger', iconName: 'Zap' },
      { name: 'Webhook', iconName: 'Webhook' },
    ],
  },
];

export const ShapeLibrary: React.FC = () => {
  const {
    isShapeLibraryOpen,
    setIsShapeLibraryOpen,
    setCurrentTool,
    setPendingNodeType,
    setPendingNodeTitle,
  } = useCanvasStore();

  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    CATEGORIES.map((c) => c.name)
  );

  if (!isShapeLibraryOpen) return null;

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleShapeSelect = (shape: ShapeItem) => {
    setPendingNodeType(shape.iconName);
    setPendingNodeTitle(shape.name);
    setCurrentTool('place');
    setIsShapeLibraryOpen(false);
  };

  return (
    <div
      className="fixed left-16 top-1/2 -translate-y-1/2 w-[280px] h-[400px] z-50 glass-panel flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-200"
      style={{
        backgroundColor: 'var(--panel)',
        backdropFilter: 'blur(24px) saturate(180%)',
      }}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-text font-semibold text-sm tracking-wide">SHAPE LIBRARY</h2>
        <button
          onClick={() => setIsShapeLibraryOpen(false)}
          className="text-text-muted hover:text-text transition-colors"
        >
          <Lucide.X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex flex-col gap-6">
          {CATEGORIES.map((category) => (
            <div key={category.name} className="flex flex-col gap-2">
              <button
                onClick={() => toggleCategory(category.name)}
                className="flex items-center gap-2 text-[10px] font-bold text-text-muted tracking-widest hover:text-text transition-colors text-left uppercase"
              >
                {expandedCategories.includes(category.name) ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
                {category.name}
              </button>

              {expandedCategories.includes(category.name) && (
                <div className="grid grid-cols-4 gap-3">
                  {category.shapes.map((shape) => {
                    const Icon = (Lucide as any)[shape.iconName] || Lucide.Box;
                    return (
                      <button
                        key={shape.name}
                        onClick={() => handleShapeSelect(shape)}
                        title={shape.name}
                        className="group flex flex-col items-center justify-center gap-1 w-[56px] h-[56px] clay-shape rounded-xl transition-all hover:scale-105 active:scale-95 border border-border hover:border-accent hover:bg-accent-light"
                        style={{
                          backgroundColor: 'var(--canvas)',
                          boxShadow: 'none',
                          color: 'var(--text)'
                        }}
                      >
                        <Icon size={20} color="currentColor" className="group-hover:text-accent transition-colors" />
                        <span className="text-[9px] text-text-muted group-hover:text-text transition-colors truncate w-full text-center px-1">
                          {shape.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
