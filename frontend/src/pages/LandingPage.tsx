import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Code2, 
  ShieldCheck, 
  ListChecks, 
  FileCode,
  Bug,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { DEMO_SNIPPETS } from '../components/DemoSelector';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDemoIdx, setActiveDemoIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const previewSnippets = DEMO_SNIPPETS.slice(0, 3);
  const currentDemo = previewSnippets[activeDemoIdx];

  const handleLaunchSample = (snippet: any) => {
    navigate('/analyze', { state: { sample: snippet } });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-16 py-10">
      
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Subtle developer badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>Universal Developer Debugging Assistant</span>
        </div>

        {/* Clear, direct headline */}
        <h1 className="text-3xl sm:text-5xl font-bold text-[#1E293B] tracking-tight leading-tight max-w-4xl mx-auto">
          Developer-Grade Error Diagnosis & Root-Cause Analysis
        </h1>

        {/* Supporting copy */}
        <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
          Paste compiler dumps, stack traces, runtime exceptions, or buggy code from any technology.
          Receive an instant root-cause analysis, step-by-step checklist, and verified drop-in code fix.
        </p>

        {/* Primary and secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/analyze"
            className="btn-primary w-full sm:w-auto px-6 py-2.5 text-sm"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch Error Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/explain"
            className="btn-secondary w-full sm:w-auto px-5 py-2.5 text-sm"
          >
            <Code2 className="w-4 h-4 text-[#0F766E]" />
            <span>Code Explainer Mode</span>
          </Link>
        </div>

        {/* Supported Stacks Ribbon */}
        <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-center gap-2 text-xs text-[#64748B]">
          <span className="font-semibold text-[#1E293B] mr-1">Supported Stacks:</span>
          {['Java & Spring Boot', 'Python & FastAPI', 'TypeScript & React', 'Rust', 'Go', 'SQL & Postgres', 'Docker'].map((tech) => (
            <span key={tech} className="px-2 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#334155] font-mono text-[11px]">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Interactive IDE Preview Mockup */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="editor-wrapper shadow-md">
          
          {/* Mockup Toolbar */}
          <div className="editor-header px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3F3F46]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3F3F46]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3F3F46]" />
              <span className="ml-2 font-mono text-xs text-[#A1A1AA]">error_inspector.log</span>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5">
              {previewSnippets.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveDemoIdx(idx)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    activeDemoIdx === idx
                      ? 'bg-[#18181B] text-[#FFFFFF] border border-[#3F3F46]'
                      : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                  }`}
                >
                  {s.language}
                </button>
              ))}
            </div>
          </div>

          {/* IDE Content: Input Trace & Side Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#3F3F46]">
            
            {/* Left: Raw Error Dump */}
            <div className="lg:col-span-6 p-4 bg-[#18181B] text-xs font-mono leading-relaxed text-[#E4E4E7] overflow-x-auto dark-scroll">
              <div className="text-[11px] text-[#71717A] mb-2 uppercase tracking-wider font-semibold">
                // Raw Stack Trace / Crash Dump
              </div>
              <pre className="whitespace-pre text-xs text-[#E4E4E7] leading-relaxed">
                {currentDemo.input}
              </pre>
            </div>

            {/* Right: Diagnosis Preview */}
            <div className="lg:col-span-6 p-4 bg-[#202023] space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]">
                    Critical Issue
                  </span>
                  <span className="text-xs font-mono text-[#A1A1AA]">
                    {currentDemo.problemType}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchSample(currentDemo)}
                  className="text-xs font-semibold text-[#5EEAD4] hover:text-[#99F6E4] flex items-center gap-1"
                >
                  <span>Open in Analyzer</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* What happened */}
              <div className="p-3 rounded-md bg-[#18181B] border border-[#3F3F46] space-y-1">
                <span className="text-[11px] font-semibold text-[#5EEAD4] uppercase flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5 text-[#0F766E]" />
                  What Happened
                </span>
                <p className="text-xs text-[#E4E4E7] leading-relaxed">
                  {currentDemo.expectedBehavior}
                </p>
              </div>

              {/* Root cause pinpoint */}
              <div className="p-3 rounded-md bg-[#450A0A]/30 border border-[#DC2626]/40 text-xs">
                <span className="text-[11px] font-semibold text-[#FECACA] block mb-1">
                  Root Cause Pinpoint:
                </span>
                <p className="text-[#E4E4E7] leading-relaxed">
                  Type mismatch or missing component dependency. Variable evaluation triggers runtime exception before execution completes.
                </p>
              </div>

              {/* Drop-in Fix */}
              <div className="p-3 rounded-md bg-[#18181B] border border-[#3F3F46] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#86EFAC] uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                    Drop-in Solution
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(currentDemo.expectedBehavior)}
                    className="text-[11px] text-[#A1A1AA] hover:text-white flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#15803D]" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-[#27272A] p-2 rounded text-xs font-mono text-[#E4E4E7]">
                  // Sanitized and typed drop-in solution ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Grid - Clean White Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-[#1E293B]">Built for Developer Workflows</h2>
          <p className="text-xs text-[#64748B]">Rigorous diagnostics without the fluff of generic AI assistants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="card p-5 space-y-2 hover:border-[#CBD5E1] transition-colors">
            <div className="w-8 h-8 rounded-md bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E]">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#1E293B]">Surgical Root Cause</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Explains exactly why the error occurred, isolating syntax errors, type coercions, race conditions, and null references.
            </p>
          </div>

          <div className="card p-5 space-y-2 hover:border-[#CBD5E1] transition-colors">
            <div className="w-8 h-8 rounded-md bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E]">
              <FileCode className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#1E293B]">Side-by-Side Diff View</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Inspect the original buggy code side-by-side with verified, refactored code and one-click clipboard copy.
            </p>
          </div>

          <div className="card p-5 space-y-2 hover:border-[#CBD5E1] transition-colors">
            <div className="w-8 h-8 rounded-md bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E]">
              <ListChecks className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#1E293B]">Actionable Checklist</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Step-by-step interactive debugging procedures so you can isolate and eliminate cascading errors systematically.
            </p>
          </div>

          <div className="card p-5 space-y-2 hover:border-[#CBD5E1] transition-colors">
            <div className="w-8 h-8 rounded-md bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E]">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#1E293B]">Multi-Turn Debug Sessions</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Preserve debugging context across multiple attempts when fixing one error reveals another downstream bug.
            </p>
          </div>

          <div className="card p-5 space-y-2 hover:border-[#CBD5E1] transition-colors">
            <div className="w-8 h-8 rounded-md bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#1E293B]">Security & Code Audit</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Proactive vulnerability scanning detects SQL injection, unvalidated inputs, memory leaks, and performance antipatterns.
            </p>
          </div>

          <div className="card p-5 space-y-2 hover:border-[#CBD5E1] transition-colors">
            <div className="w-8 h-8 rounded-md bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E]">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#1E293B]">Code Explainer Mode</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Plain-English breakdown for unfamiliar frameworks, regular expressions, complex concurrent code, and algorithms.
            </p>
          </div>

        </div>
      </section>

      {/* Simple CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 bg-[#FFFFFF] border border-[#E2E8F0] text-center space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-[#1E293B]">
            Ready to debug your current error?
          </h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            Drop in your stack trace or failing code snippet and receive an instant diagnosis.
          </p>
          <div>
            <Link
              to="/analyze"
              className="btn-primary px-6 py-2.5 text-xs font-semibold"
            >
              Start Debugging Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
