import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Rocket,
  Palette,
  Shapes,
  Link as LinkIcon,
  Keyboard,
  Share2,
  Lightbulb,
  MousePointer2,
  Square,
  Circle,
  Diamond,
  Type,
  CreditCard,
  PenTool,
  Eraser,
  Library,
  ZoomIn,
  Move,
  Grid,
  Layout,
  Maximize,
  Undo2,
  Redo2,
  HelpCircle
} from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';

const SECTIONS = [
  { id: 'quick-start', icon: Rocket, label: 'Quick Start' },
  { id: 'canvas-tools', icon: Palette, label: 'Canvas & Tools' },
  { id: 'shapes-nodes', icon: Shapes, label: 'Shapes & Nodes' },
  { id: 'connections', icon: LinkIcon, label: 'Connections' },
  { id: 'themes-styles', icon: Palette, label: 'Themes & Styles' },
  { id: 'shortcuts', icon: Keyboard, label: 'Keyboard Shortcuts' },
  { id: 'export-share', icon: Share2, label: 'Export & Share' },
  { id: 'tips-tricks', icon: Lightbulb, label: 'Tips & Tricks' },
];

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="bg-steel border border-border rounded px-2 py-0.5 font-mono text-[10px] text-text">
    {children}
  </kbd>
);

const HelpModal: React.FC = () => {
  const { isHelpModalOpen, setHelpModalOpen } = useCanvasStore();
  const [activeSection, setActiveSection] = useState('quick-start');
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startup = localStorage.getItem('lumio-help-on-startup');
    if (startup === 'false') {
      setDontShowAgain(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('lumio-help-seen', 'true');
    localStorage.setItem('lumio-help-on-startup', dontShowAgain ? 'false' : 'true');
    setHelpModalOpen(false);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dontShowAgain]);

  if (!isHelpModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-8">
      <div className="glass-panel w-full h-full max-w-6xl rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <HelpCircle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-sora font-bold text-text">Lumio Help & Guide</h2>
              <p className="text-xs text-text-muted">Master the art of visual planning</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-text-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-border p-4 flex flex-col gap-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                    : 'text-text-muted hover:bg-white/5 hover:text-text'
                }`}
              >
                <section.icon size={18} />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-16"
          >
            {/* Quick Start */}
            <section id="section-quick-start" className="space-y-6">
              <div className="flex items-center gap-3">
                <Rocket className="text-accent" size={24} />
                <h3 className="text-2xl font-sora font-bold">Quick Start</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: 1, title: 'Pick a Shape', desc: 'Click any shape in the left toolbar or open the Shape Library' },
                  { step: 2, title: 'Place on Canvas', desc: 'Click anywhere on the canvas to place your shape' },
                  { step: 3, title: 'Connect Nodes', desc: 'Drag from any node handle (dots on edges) to another node' },
                  { step: 4, title: 'Export Your Work', desc: 'Press Ctrl+E to export as SVG, PNG, or PDF' },
                ].map((item) => (
                  <div key={item.step} className="glass-panel p-6 rounded-2xl space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <span className="text-8xl font-black">{item.step}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-sora font-bold text-text mb-1">{item.title}</h4>
                      <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Canvas & Tools */}
            <section id="section-canvas-tools" className="space-y-6">
              <div className="flex items-center gap-3">
                <Palette className="text-accent" size={24} />
                <h3 className="text-2xl font-sora font-bold">Canvas & Tools</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {[
                  { icon: MousePointer2, name: 'Select', desc: 'Select and move nodes', key: 'V' },
                  { icon: Square, name: 'Rectangle', desc: 'Create a box', key: 'R' },
                  { icon: Circle, name: 'Circle', desc: 'Create an ellipse', key: 'O' },
                  { icon: Diamond, name: 'Diamond', desc: 'Create a decision node', key: 'D' },
                  { icon: Type, name: 'Text', desc: 'Add text annotations', key: 'T' },
                  { icon: CreditCard, name: 'Card', desc: 'Rich card with header', key: 'C' },
                  { icon: PenTool, name: 'Pen', desc: 'Freehand drawing', key: 'P' },
                  { icon: Eraser, name: 'Eraser', desc: 'Remove freehand strokes', key: 'E' },
                  { icon: Library, name: 'Shape Library', desc: 'Browse all shapes', key: 'L' },
                  { icon: ZoomIn, name: 'Zoom', desc: 'In/Out', key: '+ / -' },
                  { icon: Move, name: 'Pan', desc: 'Space + Drag', key: 'Space' },
                  { icon: Grid, name: 'Grid toggle', desc: 'Show/hide grid', key: 'G' },
                  { icon: Layout, name: 'Auto Layout', desc: 'Tidy up diagram', key: 'A' },
                  { icon: Maximize, name: 'Fit View', desc: 'See everything', key: 'F' },
                  { icon: Undo2, name: 'Undo', desc: 'Step back', key: 'Ctrl+Z' },
                  { icon: Redo2, name: 'Redo', desc: 'Step forward', key: 'Ctrl+Y' },
                ].map((tool) => (
                  <div key={tool.name} className="flex items-center justify-between py-2 border-b border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="text-text-muted"><tool.icon size={18} /></div>
                      <div>
                        <div className="text-sm font-semibold">{tool.name}</div>
                        <div className="text-[10px] text-text-muted">{tool.desc}</div>
                      </div>
                    </div>
                    <Kbd>{tool.key}</Kbd>
                  </div>
                ))}
              </div>
            </section>

            {/* Shapes & Nodes */}
            <section id="section-shapes-nodes" className="space-y-6">
              <div className="flex items-center gap-3">
                <Shapes className="text-accent" size={24} />
                <h3 className="text-2xl font-sora font-bold">Shapes & Nodes</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: 'Flowchart', count: 12 },
                  { name: 'System', count: 8 },
                  { name: 'Cloud', count: 15 },
                  { name: 'UI/UX', count: 20 },
                  { name: 'Logic', count: 6 },
                  { name: 'Data', count: 10 },
                  { name: 'Identity', count: 4 },
                  { name: 'Business', count: 12 },
                  { name: 'Network', count: 14 },
                  { name: 'Security', count: 8 },
                  { name: 'Mobile', count: 16 },
                  { name: 'Social', count: 5 },
                ].map((cat) => (
                  <div key={cat.name} className="glass-panel p-4 rounded-xl flex flex-col items-center text-center gap-2 hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-accent">
                      <Shapes size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{cat.name}</div>
                      <div className="text-[9px] text-text-muted">{cat.count} shapes</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-accent/10 border border-accent/20 p-4 rounded-xl text-xs flex gap-2">
                  <Lightbulb size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Tip:</strong> Double-click any node to edit its title and description.</span>
                </div>
                <div className="flex-1 bg-accent/10 border border-accent/20 p-4 rounded-xl text-xs flex gap-2">
                  <Lightbulb size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Tip:</strong> Right-click a node for more options (Duplicate, Delete, Group).</span>
                </div>
              </div>
            </section>

            {/* Connections */}
            <section id="section-connections" className="space-y-6">
              <div className="flex items-center gap-3">
                <LinkIcon className="text-accent" size={24} />
                <h3 className="text-2xl font-sora font-bold">Connections</h3>
              </div>
              <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 w-full aspect-video bg-ash/50 rounded-xl border border-border flex items-center justify-center relative overflow-hidden">
                   {/* Simplified visual illustration */}
                   <div className="flex items-center gap-20 relative">
                      <div className="w-24 h-16 bg-[var(--clay-blue)] rounded-lg border-2 border-white/20 shadow-[4px_4px_0_rgba(0,0,0,0.2)] flex items-center justify-center text-[10px] font-bold text-[#0F1117]">NODE A</div>
                      <div className="absolute left-24 right-20 h-[2px] bg-text-muted top-1/2 -translate-y-1/2">
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-text-muted"></div>
                         <div className="absolute left-1/2 -translate-x-1/2 -top-4 text-[9px] text-text-muted">Label</div>
                      </div>
                      <div className="w-24 h-16 bg-[var(--clay-purple)] rounded-lg border-2 border-white/20 shadow-[4px_4px_0_rgba(0,0,0,0.2)] flex items-center justify-center text-[10px] font-bold text-[#0F1117]">NODE B</div>

                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-success border border-white/30"></div>
                      <div className="absolute left-[90px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-success border border-white/30"></div>
                      <div className="absolute left-[174px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-success border border-white/30"></div>
                      <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-success border border-white/30"></div>
                   </div>
                   <div className="absolute bottom-4 left-4 text-[9px] text-text-muted">Visual: Connections & Handles</div>
                </div>
                <div className="flex-1 space-y-4">
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-sm">
                      <div className="mt-1 text-success"><LinkIcon size={14} /></div>
                      <span>Drag from the <strong>dot handles</strong> on node edges to connect.</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                      <div className="mt-1 text-success"><LinkIcon size={14} /></div>
                      <span>Click an <strong>edge</strong> to style it — change colour, thickness, dash style.</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                      <div className="mt-1 text-success"><LinkIcon size={14} /></div>
                      <span>Right-click a node → <strong>Track Relations</strong> to highlight all connections.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Themes & Styles */}
            <section id="section-themes-styles" className="space-y-6">
              <div className="flex items-center gap-3">
                <Palette className="text-accent" size={24} />
                <h3 className="text-2xl font-sora font-bold">Themes & Styles</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {[
                    { name: 'Slate', colors: ['#0F1117', '#6366F1', '#34D399'] },
                    { name: 'Arctic', colors: ['#F8FAFC', '#0F172A', '#38BDF8'] },
                    { name: 'Midnight', colors: ['#020617', '#818CF8', '#C084FC'] },
                    { name: 'Forest', colors: ['#052E16', '#10B981', '#FCD34D'] },
                    { name: 'Rose', colors: ['#450A0A', '#FB7185', '#FDA4AF'] },
                  ].map(theme => (
                    <div key={theme.name} className="flex-1 glass-panel p-3 rounded-xl flex flex-col items-center gap-2">
                      <div className="flex gap-1">
                        {theme.colors.map(c => <div key={c} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }}></div>)}
                      </div>
                      <span className="text-[10px] font-bold">{theme.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-text-muted">
                  Lumio uses a unique hybrid of <strong>Glassmorphism</strong> for UI panels and <strong>Claymorphism</strong> for canvas nodes, providing depth and tactility.
                </p>
                <div className="bg-white/5 p-4 rounded-xl text-xs border border-border flex gap-2">
                  <Lightbulb size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Tip:</strong> Use the colour picker in Properties Panel to customise each node's individual clay colour.</span>
                </div>
              </div>
            </section>

            {/* Keyboard Shortcuts */}
            <section id="section-shortcuts" className="space-y-6">
              <div className="flex items-center gap-3">
                <Keyboard className="text-accent" size={24} />
                <h3 className="text-2xl font-sora font-bold">Keyboard Shortcuts</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: 'Navigation',
                    items: [
                      { label: 'Pan Canvas', key: 'Space + Drag' },
                      { label: 'Zoom In', key: 'Ctrl +' },
                      { label: 'Zoom Out', key: 'Ctrl -' },
                      { label: 'Fit View', key: 'F' },
                    ]
                  },
                  {
                    title: 'Editing',
                    items: [
                      { label: 'Undo', key: 'Ctrl + Z' },
                      { label: 'Redo', key: 'Ctrl + Y' },
                      { label: 'Delete', key: 'Del' },
                      { label: 'Duplicate', key: 'Ctrl + D' },
                    ]
                  },
                  {
                    title: 'Shapes',
                    items: [
                      { label: 'Rectangle', key: 'R' },
                      { label: 'Circle', key: 'O' },
                      { label: 'Diamond', key: 'D' },
                      { label: 'Text', key: 'T' },
                    ]
                  },
                  {
                    title: 'Canvas',
                    items: [
                      { label: 'Grid Toggle', key: 'G' },
                      { label: 'Select All', key: 'Ctrl + A' },
                      { label: 'Group', key: 'Ctrl + G' },
                      { label: 'Search', key: 'Ctrl + F' },
                    ]
                  },
                ].map(group => (
                  <div key={group.title} className="space-y-3">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider">{group.title}</h4>
                    <div className="space-y-2">
                      {group.items.map(item => (
                        <div key={item.label} className="flex justify-between items-center text-sm">
                          <span className="text-text-muted">{item.label}</span>
                          <Kbd>{item.key}</Kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Export & Share */}
            <section id="section-export-share" className="space-y-6">
              <div className="flex items-center gap-3">
                <Share2 className="text-accent" size={24} />
                <h3 className="text-2xl font-sora font-bold">Export & Share</h3>
              </div>
              <div className="overflow-hidden border border-border rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 border-b border-border text-xs uppercase text-text-muted">
                    <tr>
                      <th className="px-6 py-3">Format</th>
                      <th className="px-6 py-3">Best For</th>
                      <th className="px-6 py-3">File Type</th>
                      <th className="px-6 py-3">Quality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[
                      { f: 'PNG', b: 'Sharing', t: '.png', q: 'High (2x)' },
                      { f: 'SVG', b: 'Printing', t: '.svg', q: 'Vector' },
                      { f: 'PDF', b: 'Documents', t: '.pdf', q: 'Print-ready' },
                      { f: 'JSON', b: 'Saving', t: '.json', q: 'Lossless' },
                      { f: 'Share', b: 'Links', t: 'URL', q: 'Read-only' },
                    ].map(row => (
                      <tr key={row.f} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold">{row.f}</td>
                        <td className="px-6 py-4 text-text-muted">{row.b}</td>
                        <td className="px-6 py-4"><code className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">{row.t}</code></td>
                        <td className="px-6 py-4 text-accent">{row.q}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Tips & Tricks */}
            <section id="section-tips-tricks" className="space-y-6 pb-12">
              <div className="flex items-center gap-3">
                <Lightbulb className="text-accent" size={24} />
                <h3 className="text-2xl font-sora font-bold">Tips & Tricks</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Use Ctrl+P to open the Command Palette — fastest way to do anything",
                  "Ctrl+G groups selected nodes — great for organising complex diagrams",
                  "F11 enters Presentation Mode — clean fullscreen for meetings",
                  "Right-click empty canvas → Apply Template to start from a preset",
                  "Use Track Relations to trace data flow through your architecture",
                  "Auto Layout (toolbar button) instantly tidies a messy diagram",
                  "Ctrl+F searches nodes by title — useful in large diagrams",
                  "Cast to projector sends live canvas to a second screen",
                  "Pen tool supports colour and width — annotate diagrams directly",
                  "Save as Template to reuse your diagram structure in future projects"
                ].map((tip, i) => (
                  <div key={i} className="glass-panel p-4 rounded-xl flex gap-4 items-start group hover:border-accent/30 transition-all">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <p className="text-xs leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-between bg-white/2">
          <div className="flex items-center gap-6">
            <div className="text-[10px] text-text-muted">
              Lumio v1.5 &middot; Visual Communication Platform
            </div>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-white/5 accent-accent"
              />
              <span className="text-xs text-text-muted group-hover:text-text transition-colors">Don't show on startup</span>
            </label>
          </div>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-accent hover:bg-accent/80 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-accent/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
