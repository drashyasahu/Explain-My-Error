import React, { useState } from 'react';
import { Copy, Check, Info, FileCode2, ArrowRight } from 'lucide-react';

interface DiffViewerProps {
  originalCode?: string;
  fixedCode?: string;
  whyItWorks?: string;
  language?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ 
  originalCode, 
  fixedCode, 
  whyItWorks, 
  language = 'Code' 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (fixedCode) {
      navigator.clipboard.writeText(fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderCodeWithLineNumbers = (code: string, isError: boolean = false) => {
    const lines = code.trim().split('\n');
    return (
      <div className="flex font-mono text-xs leading-relaxed select-text overflow-x-auto py-2">
        {/* Line numbers gutter */}
        <div className="select-none text-right pr-3 pl-2 text-[#71717A] border-r border-[#27272A] shrink-0">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        {/* Code body */}
        <div className="pl-3 pr-4 flex-1 text-[#E4E4E7] whitespace-pre">
          {lines.map((line, i) => (
            <div 
              key={i} 
              className={isError ? 'bg-[#450A0A]/40 -mx-3 px-3' : ''}
            >
              {line || ' '}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Original Buggy Code Box */}
        {originalCode && (
          <div className="rounded-md border border-[#3F3F46] bg-[#18181B] overflow-hidden flex flex-col shadow-sm">
            <div className="px-3 py-2 bg-[#27272A] border-b border-[#3F3F46] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                <span className="text-xs font-mono font-medium text-[#E4E4E7]">Original Code</span>
              </div>
              <span className="text-[10px] font-mono text-[#A1A1AA] uppercase">{language}</span>
            </div>
            <div className="p-2 overflow-x-auto dark-scroll flex-1">
              {renderCodeWithLineNumbers(originalCode, true)}
            </div>
          </div>
        )}

        {/* Suggested Fixed Code Box */}
        {fixedCode && (
          <div className="rounded-md border border-[#3F3F46] bg-[#18181B] overflow-hidden flex flex-col shadow-sm">
            <div className="px-3 py-2 bg-[#27272A] border-b border-[#3F3F46] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                <span className="text-xs font-mono font-medium text-[#E4E4E7]">Corrected Solution</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#3F3F46] hover:bg-[#52525B] text-[#E4E4E7] transition-colors"
                title="Copy solution"
              >
                {copied ? <Check className="w-3 h-3 text-[#15803D]" /> : <Copy className="w-3 h-3 text-[#A1A1AA]" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2 overflow-x-auto dark-scroll flex-1">
              {renderCodeWithLineNumbers(fixedCode, false)}
            </div>
          </div>
        )}
      </div>

      {/* Why this fix works card */}
      {whyItWorks && (
        <div className="p-3.5 rounded-md bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#0F766E] mt-0.5 shrink-0" />
          <div className="text-xs space-y-0.5">
            <span className="font-semibold text-[#1E293B] block">Why this fix works:</span>
            <p className="text-[#64748B] leading-relaxed">{whyItWorks}</p>
          </div>
        </div>
      )}
    </div>
  );
};
