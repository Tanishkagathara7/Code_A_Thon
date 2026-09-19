'use client';

import React from 'react';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split lines while keeping track of tables and blocks
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  const flushTable = (key: string) => {
    if (tableHeader.length > 0 || tableRows.length > 0) {
      elements.push(
        <div key={key} className="overflow-x-auto my-3 rounded-xl border border-zinc-200 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse bg-white">
            {tableHeader.length > 0 && (
              <thead className="bg-zinc-100 text-zinc-800 font-bold border-b border-zinc-200">
                <tr>
                  {tableHeader.map((th, i) => (
                    <th key={i} className="px-3.5 py-2.5 font-semibold">
                      {renderInlineFormatting(th.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-zinc-200">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-zinc-50/70 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2 text-zinc-700 leading-normal">
                      {renderInlineFormatting(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
    }
    inTable = false;
  };

  const flushCodeBlock = (key: string) => {
    if (codeBlockLines.length > 0) {
      elements.push(
        <pre key={key} className="p-3 my-2 bg-zinc-900 text-zinc-100 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed">
          <code>{codeBlockLines.join('\n')}</code>
        </pre>
      );
      codeBlockLines = [];
    }
    inCodeBlock = false;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock(`code-${idx}`);
      } else {
        if (inTable) flushTable(`table-${idx}`);
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Markdown Tables detection (e.g. | col 1 | col 2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Check if it's separator row |---|---|
      if (trimmed.replace(/[\s|:-]/g, '').length === 0) {
        continue;
      }

      const cols = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      if (!inTable) {
        inTable = true;
        tableHeader = cols;
      } else {
        tableRows.push(cols);
      }
      continue;
    } else if (inTable) {
      flushTable(`table-${idx}`);
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={idx} className="text-xs font-bold uppercase tracking-wider text-zinc-800 mt-4 mb-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>{renderInlineFormatting(trimmed.slice(5))}</span>
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={idx} className="text-sm font-extrabold text-zinc-900 mt-4 mb-2 pb-1 border-b border-zinc-100">
          {renderInlineFormatting(trimmed.slice(4))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="text-base font-black text-zinc-900 mt-5 mb-2">
          {renderInlineFormatting(trimmed.slice(3))}
        </h2>
      );
      continue;
    }

    // Blockquotes
    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={idx} className="border-l-4 border-indigo-400 bg-indigo-50/50 px-3.5 py-2 my-2 rounded-r-lg text-xs text-indigo-900 font-medium">
          {renderInlineFormatting(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Unordered List Items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1 text-xs text-zinc-700 pl-2">
          <span className="text-indigo-600 font-bold mt-0.5">•</span>
          <span className="flex-1 leading-relaxed">{renderInlineFormatting(trimmed.slice(2))}</span>
        </div>
      );
      continue;
    }

    // Ordered List Items (1. , 2. )
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1 text-xs text-zinc-700 pl-2">
          <span className="font-mono font-bold text-indigo-600 text-[11px]">{olMatch[1]}.</span>
          <span className="flex-1 leading-relaxed">{renderInlineFormatting(olMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Empty lines
    if (!trimmed) {
      elements.push(<div key={idx} className="h-2" />);
      continue;
    }

    // Regular paragraphs
    elements.push(
      <p key={idx} className="text-xs text-zinc-700 leading-relaxed my-1">
        {renderInlineFormatting(line)}
      </p>
    );
  }

  if (inTable) flushTable('table-end');
  if (inCodeBlock) flushCodeBlock('code-end');

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
};

/**
 * Parses bold (**text**), italics (*text*), code (`code`), and currency symbols cleanly.
 */
function renderInlineFormatting(text: string): React.ReactNode {
  if (!text) return '';

  // Split by bold (**...**) and inline code (`...`)
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-zinc-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-zinc-100 text-indigo-700 font-mono text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
