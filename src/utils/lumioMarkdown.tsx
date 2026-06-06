import React from 'react';
import * as LucideIcons from 'lucide-react';

export type BlockType = 'heading1' | 'heading2' | 'paragraph' | 'bullet' | 'numbered' | 'quote' | 'code' | 'divider' | 'image' | 'codeblock' | 'table';

export interface ParsedBlock {
  type: BlockType;
  content: string;
  meta?: {
    level?: number;
    color?: string;
    src?: string;
    rows?: string[][];
  };
}

export function parseLumioMarkdown(raw: string): ParsedBlock[] {
  if (!raw) return [];
  const lines = raw.split('\n');
  const blocks: ParsedBlock[] = [];
  let currentCodeBlock: string[] | null = null;
  let currentTableRows: string[][] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Code Blocks
    if (line.trim().startsWith('```')) {
      if (currentCodeBlock !== null) {
        blocks.push({ type: 'codeblock', content: currentCodeBlock.join('\n') });
        currentCodeBlock = null;
      } else {
        currentCodeBlock = [];
      }
      continue;
    }

    if (currentCodeBlock !== null) {
      currentCodeBlock.push(line);
      continue;
    }

    const trimmed = line.trim();

    // Handle Tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

      // Skip alignment rows like |---|---|
      if (cells.every(c => c.match(/^-+$/))) {
        continue;
      }

      if (currentTableRows === null) {
        currentTableRows = [cells];
      } else {
        currentTableRows.push(cells);
      }
      continue;
    } else {
      if (currentTableRows !== null) {
        blocks.push({ type: 'table', content: '', meta: { rows: currentTableRows } });
        currentTableRows = null;
      }
    }

    if (trimmed === '') continue;

    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'heading1', content: trimmed.slice(2) });
    } else if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'heading2', content: trimmed.slice(3) });
    } else if (trimmed.startsWith('- ')) {
      blocks.push({ type: 'bullet', content: trimmed.slice(2) });
    } else if (/^\d+\. /.test(trimmed)) {
      blocks.push({ type: 'numbered', content: trimmed.replace(/^\d+\. /, '') });
    } else if (trimmed.startsWith('> ')) {
      blocks.push({ type: 'quote', content: trimmed.slice(2) });
    } else if (trimmed === '---' || trimmed === '***') {
      blocks.push({ type: 'divider', content: '' });
    } else if (trimmed.startsWith('[img:') && trimmed.endsWith(']')) {
      const src = trimmed.slice(5, -1);
      blocks.push({ type: 'image', content: '', meta: { src } });
    } else if (trimmed.startsWith('![') && trimmed.includes('](') && trimmed.endsWith(')')) {
      const altMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
      if (altMatch) {
        blocks.push({ type: 'image', content: altMatch[1], meta: { src: altMatch[2] } });
      }
    } else {
      blocks.push({ type: 'paragraph', content: trimmed });
    }
  }

  // Cleanup pending blocks
  if (currentCodeBlock !== null) {
    blocks.push({ type: 'codeblock', content: currentCodeBlock.join('\n') });
  }
  if (currentTableRows !== null) {
    blocks.push({ type: 'table', content: '', meta: { rows: currentTableRows } });
  }

  return blocks;
}

function applyRegex(
  parts: (string | React.ReactNode)[],
  regex: RegExp,
  replacement: (...args: string[]) => React.ReactNode
) {
  for (let i = 0; i < parts.length; i++) {
    if (typeof parts[i] !== 'string') continue;
    const str = parts[i] as string;
    const newParts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match;
    regex.lastIndex = 0;
    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        newParts.push(str.substring(lastIndex, match.index));
      }
      newParts.push(replacement(...match.slice(1)));
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < str.length) {
      newParts.push(str.substring(lastIndex));
    }
    if (newParts.length > 0) {
      parts.splice(i, 1, ...newParts);
      i += newParts.length - 1;
    }
  }
}

const InlineRenderer: React.FC<{ text: string }> = ({ text }) => {
  const parts: (string | React.ReactNode)[] = [text];

  applyRegex(parts, /\*\*(.*?)\*\*/g, (c) => <strong key={c} className="font-bold text-text">{c}</strong>);
  applyRegex(parts, /\*(.*?)\*/g, (c) => <em key={c} className="italic">{c}</em>);
  applyRegex(parts, /`(.*?)`/g, (c) => (
    <code key={c} className="bg-accent/20 text-accent px-1.5 py-0.5 rounded font-mono text-[0.9em]">
      {c}
    </code>
  ));
  applyRegex(parts, /==(.*?)==/g, (c) => (
    <mark key={c} className="bg-accent/40 text-text px-1 rounded">
      {c}
    </mark>
  ));
  applyRegex(parts, /::(.*?)::(.*?)::/g, (color, content) => (
    <span key={content} style={{ color }}>{content}</span>
  ));
  applyRegex(parts, /\[icon:(.*?)\]/g, (name) => {
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon key={name} size={18} className="inline-block align-text-bottom mx-1 text-accent" /> : <span key={name}>{`[${name}]`}</span>;
  });
  applyRegex(parts, /\[(.*?)\]\((.*?)\)/g, (text, url) => (
    <a
      key={url}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:underline cursor-pointer font-medium"
      onClick={(e) => e.stopPropagation()}
    >
      {text}
    </a>
  ));

  return <>{parts.map((p, i) => <React.Fragment key={i}>{p}</React.Fragment>)}</>;
};

export function renderLumioMarkdown(raw: string, compact: boolean = false): React.ReactNode {
  const blocks = parseLumioMarkdown(raw);

  return (
    <div className={`flex flex-col ${compact ? 'gap-1' : 'gap-4'} font-sans ${compact ? 'text-[10px]' : 'text-sm'} leading-relaxed text-text/90`}>
      {blocks.map((block, idx) => {
        if (compact && idx > 2) return null; // Only show first 3 blocks in compact mode

        switch (block.type) {
          case 'heading1':
            return (
              <div key={idx} className={compact ? 'mt-1 mb-0' : 'group mt-6 mb-2'}>
                <h1 className={`font-sora ${compact ? 'text-[12px]' : 'text-[22px]'} font-black text-text ${!compact && 'border-b-2 border-accent/20 pb-2'} flex items-center gap-2`}>
                  {!compact && <span className="w-1.5 h-6 bg-accent rounded-full opacity-50" />}
                  <InlineRenderer text={block.content} />
                </h1>
              </div>
            );
          case 'heading2':
            return (
              <h2 key={idx} className={`font-sora ${compact ? 'text-[11px]' : 'text-[18px]'} font-bold ${compact ? 'mt-1' : 'mt-5 mb-1'} text-text flex items-center gap-2`}>
                {!compact && <span className="w-1 h-4 bg-accent/40 rounded-full" />}
                <InlineRenderer text={block.content} />
              </h2>
            );
          case 'paragraph':
            return (
              <p key={idx} className={`${compact ? 'mb-0' : 'mb-3'} leading-relaxed text-text/80`}>
                <InlineRenderer text={block.content} />
              </p>
            );
          case 'bullet':
            return (
              <div key={idx} className={`flex gap-3 ${compact ? 'pl-1' : 'pl-4'} group`}>
                <span className={`text-accent font-black ${compact ? 'text-[8px]' : 'mt-0.5'} group-hover:scale-125 transition-transform`}>•</span>
                <span className="text-text/80"><InlineRenderer text={block.content} /></span>
              </div>
            );
          case 'numbered':
            return (
              <div key={idx} className={`flex gap-3 ${compact ? 'pl-1' : 'pl-4'}`}>
                <span className={`text-accent font-mono font-bold ${compact ? 'text-[8px]' : 'mt-0.5'}`}>{idx + 1}.</span>
                <span className="text-text/80"><InlineRenderer text={block.content} /></span>
              </div>
            );
          case 'quote':
            if (compact) return <p key={idx} className="italic text-text-muted border-l-2 border-accent pl-2"><InlineRenderer text={block.content} /></p>;
            return (
              <blockquote key={idx} className="border-l-4 border-accent bg-accent/5 px-5 py-3 my-3 italic text-text-muted rounded-r-lg shadow-sm">
                <InlineRenderer text={block.content} />
              </blockquote>
            );
          case 'divider':
            if (compact) return <hr key={idx} className="border-border/30 my-1" />;
            return (
              <div key={idx} className="flex items-center gap-4 my-6 opacity-30">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-text to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-text rotate-45" />
                <div className="h-px flex-1 bg-gradient-to-r from-text via-text to-transparent" />
              </div>
            );
          case 'image':
            return (
              <div key={idx} className={`${compact ? 'my-1' : 'my-4'} group`}>
                <img
                  src={block.meta?.src}
                  alt={block.content || ""}
                  className={`max-w-full rounded-xl ${!compact && 'shadow-2xl border border-white/10 hover:border-accent/50'} transition-all duration-300`}
                />
                {!compact && block.content && <p className="text-[10px] text-center mt-2 text-text-muted uppercase tracking-widest font-bold">{block.content}</p>}
              </div>
            );
          case 'codeblock':
            return (
              <div key={idx} className={`relative group ${compact ? 'my-1' : 'my-4'}`}>
                {!compact && <div className="absolute -top-3 right-4 px-2 py-0.5 bg-graphite text-[10px] font-bold rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity">CODE</div>}
                <pre className={`${compact ? 'p-2' : 'p-5'} bg-void/60 rounded-xl font-mono ${compact ? 'text-[9px]' : 'text-[13px]'} border border-white/5 overflow-x-auto custom-scrollbar shadow-inner`}>
                  <code className="text-accent-light/90">{block.content}</code>
                </pre>
              </div>
            );
          case 'table':
            return (
              <div key={idx} className={`${compact ? 'my-2' : 'my-6'} overflow-hidden rounded-xl border border-border shadow-lg`}>
                <table className="w-full text-left border-collapse bg-void/20 table-fixed">
                  <thead className="bg-accent/10">
                    <tr>
                      {block.meta?.rows?.[0].map((cell, i) => (
                        <th key={i} className={`${compact ? 'px-2 py-1 text-[8px]' : 'px-4 py-3 text-[11px]'} font-black uppercase tracking-wider text-accent border-b border-border`}>
                          <InlineRenderer text={cell} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.meta?.rows?.slice(1).map((row, ri) => (
                      <tr key={ri} className="hover:bg-white/5 transition-colors">
                        {row.map((cell, ci) => (
                          <td key={ci} className={`${compact ? 'px-2 py-1 text-[8px]' : 'px-4 py-2.5 text-[12px]'} border-b border-white/5 text-text/70 truncate`}>
                            <InlineRenderer text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
