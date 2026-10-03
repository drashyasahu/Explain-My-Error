import React from 'react';
import { Terminal, Shield, CheckCircle2, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#18181B] border-t border-[#27272A] text-[#A1A1AA] text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 select-none">
              <div className="w-6 h-6 rounded bg-[#27272A] border border-[#3F3F46] flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5 text-[#0F766E]" />
              </div>
              <span className="font-mono font-bold text-sm tracking-tight">
                <span className="text-[#FFFFFF]">Explain</span>
                <span className="text-[#0F766E]">MyError</span>
              </span>
            </div>
            <p className="text-[#A1A1AA] text-xs leading-relaxed">
              Developer-focused debugging platform. Parse stack traces, pinpoint root causes, and generate drop-in code fixes.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA]">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <span>Ollama / Spring AI Engine Active</span>
            </div>
          </div>

          {/* Modes Column */}
          <div>
            <h4 className="text-[#FFFFFF] font-semibold text-xs tracking-wider uppercase mb-3">
              Developer Modes
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/analyze" className="text-[#5EEAD4] hover:text-[#99F6E4] transition-colors">
                  Error Diagnosis & Stack Traces
                </Link>
              </li>
              <li>
                <Link to="/explain" className="text-[#5EEAD4] hover:text-[#99F6E4] transition-colors">
                  Code Explainer & Logic Breakdown
                </Link>
              </li>
              <li>
                <Link to="/review" className="text-[#5EEAD4] hover:text-[#99F6E4] transition-colors">
                  Security Audit & Quality Review
                </Link>
              </li>
              <li>
                <Link to="/sessions" className="text-[#5EEAD4] hover:text-[#99F6E4] transition-colors">
                  Multi-turn Debugging Sessions
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Technologies */}
          <div>
            <h4 className="text-[#FFFFFF] font-semibold text-xs tracking-wider uppercase mb-3">
              Supported Stacks
            </h4>
            <ul className="space-y-2 text-[#A1A1AA]">
              <li>Java 21, Spring Boot, Maven, Gradle</li>
              <li>Python, FastAPI, Django, Flask</li>
              <li>TypeScript, React, Node.js, Next.js</li>
              <li>Go, Rust, C/C++, C#/.NET, SQL, Docker</li>
            </ul>
          </div>

          {/* Privacy & Enterprise */}
          <div>
            <h4 className="text-[#FFFFFF] font-semibold text-xs tracking-wider uppercase mb-3">
              Reliability & Standards
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-[#0F766E] mt-0.5 shrink-0" />
                <span className="text-[#A1A1AA]">Zero Data Retention & Training Privacy</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] mt-0.5 shrink-0" />
                <span className="text-[#A1A1AA]">Verified Side-by-Side Diff Generation</span>
              </div>
              <div className="flex items-start gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#A1A1AA] mt-0.5 shrink-0" />
                <span className="text-[#A1A1AA]">Deterministic Parsing & Regex Matchers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A1A1AA] gap-3">
          <p>© {new Date().getFullYear()} ExplainMyError. Built for developers and engineering teams.</p>
          <div className="flex items-center gap-4">
            <Link to="/statistics" className="text-[#5EEAD4] hover:text-[#99F6E4]">Telemetry</Link>
            <span className="text-[#3F3F46]">•</span>
            <Link to="/history" className="text-[#5EEAD4] hover:text-[#99F6E4]">Past Analyses</Link>
            <span className="text-[#3F3F46]">•</span>
            <span>Local Instance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
