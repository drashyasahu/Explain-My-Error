import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, Loader2, AlertTriangle, Terminal, Compass, HelpCircle } from 'lucide-react';
import { codeService } from '../services/codeService';
import { AnalysisResponse, LANGUAGES } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import { DiffViewer } from '../components/DiffViewer';

export const ReviewPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('AUTO');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [review, setReview] = useState<AnalysisResponse | null>(null);

  const sampleVulnerableCode = `// Express.js route with direct SQL injection vulnerability
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Directly concatenated unsanitized query parameters!
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  const user = await db.query(query);
  if (user.length > 0) {
    res.json({ status: 'ok', user: user[0] });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});`;

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await codeService.reviewCode({
        input: code.trim(),
        language: language === 'AUTO' ? undefined : language,
        mode: 'CODE_REVIEW'
      });
      setReview(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Review failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#0F766E]" />
          Code Review & Security Audit
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Perform instantaneous static analysis for security vulnerabilities (SQLi, XSS), race conditions, resource leaks, and edge-case bugs.
        </p>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleReview} className="space-y-4">
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
              onClick={() => { setCode(sampleVulnerableCode); setLanguage('JavaScript'); }}
              className="text-xs text-[#5EEAD4] hover:text-[#99F6E4] font-medium"
            >
              Load Sample: SQL Injection Vulnerability
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste source code for security review and quality audit..."
            rows={8}
            className="w-full bg-[#18181B] p-4 font-mono text-xs text-[#E4E4E7] placeholder-[#71717A] focus:outline-none border-none resize-y dark-scroll"
            required
          />

          <div className="px-3.5 py-2.5 bg-[#27272A] border-t border-[#3F3F46] flex justify-between items-center">
            <span className="text-[11px] text-[#A1A1AA] font-mono">
              {code.length > 0 ? `${code.length} characters` : 'Ready for analysis'}
            </span>
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="btn-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Audit Code</span>
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

      {/* Review Output Cards */}
      {review && (
        <div className="space-y-4 pt-2">
          
          {/* Summary Card */}
          <div className="card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={review.severity} />
                <h3 className="text-base font-bold text-[#1E293B]">
                  {review.errorName || 'Security Audit Findings'}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md border border-[#E2E8F0] bg-white space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1E293B] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#0F766E]" />
                  Identified Vulnerability
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {review.whatHappened}
                </p>
              </div>

              <div className="p-4 rounded-md border border-[#E2E8F0] bg-white space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1E293B] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#0F766E]" />
                  Exploit Risk & Threat Vector
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {review.whyItHappened}
                </p>
              </div>
            </div>
          </div>

          {/* Secure Drop-in Patch Card */}
          <div className="card p-5 space-y-4">
            <div className="pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-semibold text-[#1E293B] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                Secured Refactored Implementation
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                {review.suggestedFix?.explanation}
              </p>
            </div>

            <DiffViewer
              originalCode={review.suggestedFix?.originalCode || code}
              fixedCode={review.suggestedFix?.fixedCode}
              whyItWorks={review.suggestedFix?.whyItWorks}
              language={review.language}
            />
          </div>

          {/* Hardening & Defense in Depth */}
          {review.prevention && (
            <div className="card p-5 space-y-2">
              <h4 className="text-xs font-semibold text-[#1E293B] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#0F766E]" />
                Hardening Checklist & Security Best Practices
              </h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {review.prevention}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
