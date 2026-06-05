import {
  FilePlus, FolderOpen, Save, Share2, FileCode, FileImage, FileText,
  Undo2, Redo2, MousePointer2, Copy, ClipboardPaste, Trash2, Group, Ungroup,
  Layout, Maximize, Grid, Map, ZoomIn, ZoomOut, RefreshCcw,
  Square, Circle, Diamond, Type, CreditCard, Library,
  Presentation, PanelRight, Moon, Palette, PenTool,
  LucideIcon
} from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';
import { useFileIO } from '../hooks/useFileIO';
import { useExport } from '../hooks/useExport';
import { useReactFlow } from '@xyflow/react';

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  shortcut?: string;
  action: () => void;
  category: 'canvas' | 'file' | 'view' | 'shape' | 'edit';
}

export const useCommandList = () => {
  const store = useCanvasStore();
  const { saveProject, loadProject } = useFileIO();
  const { exportAsSVG, handlePNGExport, handlePDFExport, handleCopyToClipboard } = useExport();
  const { fitView, zoomIn, zoomOut, setViewport, deleteElements } = useReactFlow();

  const commands: Command[] = [
    // FILE
    {
      id: 'new-project',
      label: 'New Project',
      description: 'Clear canvas and start fresh',
      icon: FilePlus,
      category: 'file',
      action: () => {
        if (confirm('Are you sure? Unsaved changes will be lost.')) {
          store.setNodes([]);
          store.setEdges([]);
          store.setProjectName('Untitled Project');
          store.setProjectPath(null);
          store.setIsDirty(false);
        }
      }
    },
    {
      id: 'open-project',
      label: 'Open Project',
      description: 'Load a project from file',
      icon: FolderOpen,
      shortcut: 'Ctrl+O',
      category: 'file',
      action: () => { loadProject(); }
    },
    {
      id: 'save-project',
      label: 'Save Project',
      description: 'Save current project to file',
      icon: Save,
      shortcut: 'Ctrl+S',
      category: 'file',
      action: () => { saveProject(store.projectName); }
    },
    {
      id: 'export-svg',
      label: 'Export SVG',
      description: 'Export canvas as scalable vector graphic',
      icon: FileCode,
      category: 'file',
      action: () => { exportAsSVG(); }
    },
    {
      id: 'export-png',
      label: 'Export PNG',
      description: 'Export canvas as high-res image',
      icon: FileImage,
      category: 'file',
      action: () => { handlePNGExport(); }
    },
    {
      id: 'export-pdf',
      label: 'Export PDF',
      description: 'Export canvas as PDF document',
      icon: FileText,
      category: 'file',
      action: () => { handlePDFExport(); }
    },
    {
      id: 'share-project',
      label: 'Share Project',
      description: 'Invite others to collaborate',
      icon: Share2,
      category: 'file',
      action: () => { store.setShareModalOpen(true); }
    },

    // EDIT
    {
      id: 'undo',
      label: 'Undo',
      description: 'Revert last action',
      icon: Undo2,
      shortcut: 'Ctrl+Z',
      category: 'edit',
      action: () => { store.undo(); }
    },
    {
      id: 'redo',
      label: 'Redo',
      description: 'Restore reverted action',
      icon: Redo2,
      shortcut: 'Ctrl+Shift+Z',
      category: 'edit',
      action: () => { store.redo(); }
    },
    {
      id: 'select-all',
      label: 'Select All',
      description: 'Select all elements on canvas',
      icon: MousePointer2,
      shortcut: 'Ctrl+A',
      category: 'edit',
      action: () => { store.selectAll(); }
    },
    {
      id: 'copy',
      label: 'Copy',
      description: 'Copy selected elements',
      icon: Copy,
      shortcut: 'Ctrl+C',
      category: 'edit',
      action: () => { store.copy(); }
    },
    {
      id: 'paste',
      label: 'Paste',
      description: 'Paste elements from clipboard',
      icon: ClipboardPaste,
      shortcut: 'Ctrl+V',
      category: 'edit',
      action: () => { store.paste(); }
    },
    {
      id: 'delete-selected',
      label: 'Delete Selected',
      description: 'Remove selected elements',
      icon: Trash2,
      shortcut: 'Del',
      category: 'edit',
      action: () => {
        const nodesToDelete = store.nodes.filter(n => store.selectedNodeIds.includes(n.id));
        const edgesToDelete = store.edges.filter(e => store.selectedEdgeIds.includes(e.id));
        deleteElements({ nodes: nodesToDelete, edges: edgesToDelete });
        store.deleteSelectedNodes();
      }
    },
    {
      id: 'group-selected',
      label: 'Group Selected',
      description: 'Group selected nodes into a container',
      icon: Group,
      shortcut: 'Ctrl+G',
      category: 'edit',
      action: () => { store.groupSelectedNodes(); }
    },
    {
      id: 'ungroup',
      label: 'Ungroup',
      description: 'Dissolve selected groups',
      icon: Ungroup,
      shortcut: 'Ctrl+Shift+G',
      category: 'edit',
      action: () => { store.ungroupSelectedNodes(); }
    },

    // CANVAS
    {
      id: 'auto-layout',
      label: 'Auto Layout',
      description: 'Organize nodes automatically',
      icon: Layout,
      category: 'canvas',
      action: () => {
        // Logic for auto layout if available, or just a toast
        console.log('Auto layout requested');
      }
    },
    {
      id: 'fit-view',
      label: 'Fit View',
      description: 'Center all elements in view',
      icon: Maximize,
      category: 'canvas',
      action: () => { fitView({ duration: 400 }); }
    },
    {
      id: 'toggle-grid',
      label: 'Toggle Grid',
      description: 'Show or hide background grid',
      icon: Grid,
      category: 'canvas',
      action: () => { store.toggleGrid(); }
    },
    {
      id: 'toggle-minimap',
      label: 'Toggle Minimap',
      description: 'Show or hide overview map',
      icon: Map,
      category: 'canvas',
      action: () => { store.toggleMinimap(); }
    },
    {
      id: 'zoom-in',
      label: 'Zoom In',
      description: 'Increase magnification',
      icon: ZoomIn,
      shortcut: 'Ctrl++',
      category: 'canvas',
      action: () => { zoomIn({ duration: 200 }); }
    },
    {
      id: 'zoom-out',
      label: 'Zoom Out',
      description: 'Decrease magnification',
      icon: ZoomOut,
      shortcut: 'Ctrl+-',
      category: 'canvas',
      action: () => { zoomOut({ duration: 200 }); }
    },
    {
      id: 'reset-zoom',
      label: 'Reset Zoom',
      description: 'Set zoom level to 100%',
      icon: RefreshCcw,
      shortcut: 'Ctrl+0',
      category: 'canvas',
      action: () => { setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 400 }); }
    },
    {
      id: 'change-grid-style',
      label: 'Change Grid Style',
      description: 'Cycle through available grid backgrounds',
      icon: Grid,
      category: 'canvas',
      action: () => {
        const styles: ('none' | 'dots' | 'lines' | 'crosshatch')[] = ['none', 'dots', 'lines', 'crosshatch'];
        const current = store.gridStyle;
        const next = styles[(styles.indexOf(current) + 1) % styles.length];
        store.setGridStyle(next);
      }
    },

    // SHAPE
    {
      id: 'add-rectangle',
      label: 'Add Rectangle',
      description: 'Insert a rectangular shape',
      icon: Square,
      shortcut: 'R',
      category: 'shape',
      action: () => { store.setCurrentTool('rect'); }
    },
    {
      id: 'add-circle',
      label: 'Add Circle',
      description: 'Insert a circular shape',
      icon: Circle,
      shortcut: 'C',
      category: 'shape',
      action: () => { store.setCurrentTool('circle'); }
    },
    {
      id: 'add-diamond',
      label: 'Add Diamond',
      description: 'Insert a diamond shape',
      icon: Diamond,
      shortcut: 'D',
      category: 'shape',
      action: () => { store.setCurrentTool('diamond'); }
    },
    {
      id: 'add-text',
      label: 'Add Text',
      description: 'Insert a text element',
      icon: Type,
      shortcut: 'T',
      category: 'shape',
      action: () => { store.setCurrentTool('text'); }
    },
    {
      id: 'add-card',
      label: 'Add Card',
      description: 'Insert a rich information card',
      icon: CreditCard,
      category: 'shape',
      action: () => { store.setCurrentTool('card'); }
    },
    {
      id: 'open-shape-library',
      label: 'Open Shape Library',
      description: 'Browse all available shapes',
      icon: Library,
      shortcut: 'L',
      category: 'shape',
      action: () => { store.setIsShapeLibraryOpen(true); }
    },

    // VIEW
    {
      id: 'toggle-presentation',
      label: 'Toggle Presentation Mode',
      description: 'Switch to full-screen focus view',
      icon: Presentation,
      shortcut: 'F11',
      category: 'view',
      action: () => { store.togglePresentationMode(); }
    },
    {
      id: 'toggle-properties',
      label: 'Toggle Properties Panel',
      description: 'Show or hide the right sidebar',
      icon: PanelRight,
      category: 'view',
      action: () => { store.togglePanelOpen(); }
    },
    {
      id: 'toggle-dark-light',
      label: 'Toggle Dark/Light',
      description: 'Switch between dark and light themes',
      icon: Moon,
      category: 'view',
      action: () => {
        const theme = store.currentTheme;
        if (theme === 'dark' || theme === 'slate' || theme === 'zinc') {
          store.setTheme('glass');
        } else {
          store.setTheme('slate');
        }
      }
    },
    {
      id: 'change-theme',
      label: 'Change Theme',
      description: 'Open the theme customization picker',
      icon: Palette,
      category: 'view',
      action: () => { store.setThemePickerOpen(true); }
    },
    {
      id: 'toggle-freehand',
      label: 'Toggle Freehand Mode',
      description: 'Enable or disable drawing mode',
      icon: PenTool,
      shortcut: 'P',
      category: 'view',
      action: () => {
        store.setCanvasMode(store.canvasMode === 'freehand' ? 'diagram' : 'freehand');
      }
    },
  ];

  return commands;
};
