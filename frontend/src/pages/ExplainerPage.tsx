import React, { useState } from 'react';
import { BookOpen, Loader2, Code2, Copy, Check, Terminal, Compass, HelpCircle, ShieldAlert } from 'lucide-react';
import { codeService } from '../services/codeService';
import { AnalysisResponse, LANGUAGES } from '../types';

export const ExplainerPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('AUTO');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<AnalysisResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExplain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await codeService.explainCode({
        input: code.trim(),
        language: language === 'AUTO' ? undefined : language,
        mode: 'CODE_EXPLANATION'
      });
      setExplanation(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to explain code');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleSnippet = `// Custom React debounce hook with timeout cleanup
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`;

  const handleCopyFixed = () => {
    if (explanation?.suggestedFix?.fixedCode) {
      navigator.clipboard.writeText(explanation.suggestedFix.fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#0F766E]" />
          Code Explainer & Logic Breakdown
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Paste any algorithm, regex, unfamiliar library syntax, or asynchronous routine for an intuitive conceptual explanation.
        </p>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleExplain} className="space-y-4">
        <div className="editor-wrapper shadow-sm">
          
          <div className="editor-header px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#18181B] border border-[#3F3F46] rounded-md px-2.5 py-1 text-xs text-[#E4E4E7] font-medium focus:outline-none focus:border-[#0F766E]"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l === 'AUTO' ? 'Auto-Detect Language' : l}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => { setCode(sampleSnippet); setLanguage('TypeScript'); }}
              className="text-xs text-[#5EEAD4] hover:text-[#99F6E4] font-medium"
            >
              Load Sample: React useDebounce
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste code you want explained in plain English..."
            rows={8}
            className="w-full bg-[#18181B] p-4 font-mono text-xs text-[#E4E4E7] placeholder-[#71717A] focus:outline-none border-none resize-y dark-scroll"
            required
          />

          <div className="px-3.5 py-2.5 bg-[#27272A] border-t border-[#3F3F46] flex justify-between items-center">
            <span className="text-[11px] text-[#A1A1AA] font-mono">
              {code.length > 0 ? `${code.length} characters` : 'Ready for input'}
            </span>
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="btn-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Explaining...</span>
                </>
              ) : (
                <>
                  <Code2 className="w-4 h-4" />
                  <span>Explain Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-md bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs">
          {errorMsg}
        </div>
      )}

      {/* Explanation Cards Output */}
      {explanation && (
        <div className="space-y-4 pt-2">
          
          {/* Card 1: Overview & What It Does */}
          <div className="card p-5 space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
              <Compass className="w-4 h-4 text-[#0F766E]" />
              <h3 className="text-sm font-semibold text-[#1E293B]">Conceptual Summary & Purpose</h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed pt-1">
              {explanation.whatHappened}
            </p>
          </div>

          {/* Card 2: Detailed Line-by-Line Mechanics */}
          <div className="card p-5 space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
              <HelpCircle className="w-4 h-4 text-[#0F766E]" />
              <h3 className="text-sm font-semibold text-[#1E293B]">How It Works Under the Hood</h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed pt-1">
              {explanation.whyItHappened}
            </p>
          </div>

          {/* Card 3: Key Patterns, Pitfalls & Edge Cases */}
          {explanation.prevention && (
            <div className="card p-5 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                <ShieldAlert className="w-4 h-4 text-[#0F766E]" />
                <h3 className="text-sm font-semibold text-[#1E293B]">Edge Cases, Complexity & Memory Nuances</h3>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed pt-1">
                {explanation.prevention}
              </p>
            </div>
          )}

          {/* Card 4: Recommended Idiomatic Version */}
          {explanation.suggestedFix?.fixedCode && (
            <div className="card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#0F766E]" />
                  <h3 className="text-sm font-semibold text-[#1E293B]">Refactored Idiomatic Alternative</h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopyFixed}
                  className="btn-secondary text-xs px-2.5 py-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="editor-wrapper">
                <pre className="p-4 text-xs font-mono text-[#E4E4E7] overflow-x-auto dark-scroll whitespace-pre leading-relaxed">
                  {explanation.suggestedFix.fixedCode}
                </pre>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
