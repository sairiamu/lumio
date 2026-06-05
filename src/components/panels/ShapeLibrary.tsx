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
        backgroundColor: 'rgba(37, 40, 48, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-cloud font-semibold text-sm tracking-wide">SHAPE LIBRARY</h2>
        <button
          onClick={() => setIsShapeLibraryOpen(false)}
          className="text-fog hover:text-cloud transition-colors"
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
                className="flex items-center gap-2 text-[10px] font-bold text-fog tracking-widest hover:text-cloud transition-colors text-left uppercase"
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
                        className="group flex flex-col items-center justify-center gap-1 w-[56px] h-[56px] clay-shape rounded-xl transition-all hover:scale-105 active:scale-95 border-2 border-transparent hover:border-iris"
                        style={{
                          backgroundColor: 'var(--graphite)',
                          boxShadow: '4px 4px 0px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.1)',
                        }}
                      >
                        <Icon size={20} className="text-cloud group-hover:text-iris transition-colors" />
                        <span className="text-[9px] text-fog group-hover:text-cloud transition-colors truncate w-full text-center px-1">
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
