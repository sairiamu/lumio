import React from 'react';
import * as LucideIcons from 'lucide-react';

export type BlockType = 'heading1' | 'heading2' | 'paragraph' | 'bullet' | 'numbered' | 'quote' | 'code' | 'divider' | 'image' | 'codeblock';

export interface ParsedBlock {
  type: BlockType;
  content: string;
  meta?: {
    level?: number;
    color?: string;
    src?: string;
  };
}

export function parseLumioMarkdown(raw: string): ParsedBlock[] {
  if (!raw) return [];
  const lines = raw.split('\n');
  const blocks: ParsedBlock[] = [];
  let currentCodeBlock: string[] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
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
    } else if (trimmed === '---') {
      blocks.push({ type: 'divider', content: '' });
    } else if (trimmed.startsWith('[img:') && trimmed.endsWith(']')) {
      const src = trimmed.slice(5, -1);
      blocks.push({ type: 'image', content: '', meta: { src } });
    } else {
      blocks.push({ type: 'paragraph', content: trimmed });
    }
  }

  if (currentCodeBlock !== null) {
    blocks.push({ type: 'codeblock', content: currentCodeBlock.join('\n') });
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
    <code key={c} className="bg-accent/20 text-accent px-1 rounded font-mono text-[0.9em]">
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

  return <>{parts.map((p, i) => <React.Fragment key={i}>{p}</React.Fragment>)}</>;
};

export function renderLumioMarkdown(raw: string): React.ReactNode {
  const blocks = parseLumioMarkdown(raw);

  return (
    <div className="flex flex-col gap-3 font-sans text-sm leading-relaxed text-text">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading1':
            return (
              <h1 key={idx} className="font-sora text-[20px] font-bold mt-4 mb-2 text-text">
                <InlineRenderer text={block.content} />
              </h1>
            );
          case 'heading2':
            return (
              <h2 key={idx} className="font-sora text-[16px] font-semibold mt-3 mb-1 text-text">
                <InlineRenderer text={block.content} />
              </h2>
            );
          case 'paragraph':
            return (
              <p key={idx} className="mb-1">
                <InlineRenderer text={block.content} />
              </p>
            );
          case 'bullet':
            return (
              <div key={idx} className="flex gap-2 pl-2">
                <span className="text-accent">•</span>
                <span><InlineRenderer text={block.content} /></span>
              </div>
            );
          case 'numbered':
            return (
              <div key={idx} className="flex gap-2 pl-2">
                <span className="text-accent font-mono">{idx + 1}.</span>
                <span><InlineRenderer text={block.content} /></span>
              </div>
            );
          case 'quote':
            return (
              <blockquote key={idx} className="border-l-4 border-accent bg-accent/5 px-4 py-2 my-2 italic text-text-muted rounded-r">
                <InlineRenderer text={block.content} />
              </blockquote>
            );
          case 'divider':
            return <hr key={idx} className="border-border my-4" />;
          case 'image':
            return <img key={idx} src={block.meta?.src} alt="" className="max-w-full rounded-lg shadow-lg my-2 border border-border" />;
          case 'codeblock':
            return (
              <pre key={idx} className="bg-void/50 p-4 rounded-lg font-mono text-[13px] border border-border overflow-x-auto my-2 custom-scrollbar">
                <code>{block.content}</code>
              </pre>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
