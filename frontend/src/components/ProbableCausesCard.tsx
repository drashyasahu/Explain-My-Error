import React from 'react';
import { ProbableCause } from '../types';
import { AlertCircle } from 'lucide-react';

interface ProbableCausesProps {
  causes?: ProbableCause[];
}

export const ProbableCausesCard: React.FC<ProbableCausesProps> = ({ causes = [] }) => {
  if (!causes || causes.length === 0) return null;

  return (
    <div className="card p-5 space-y-4">
      <div className="pb-3 border-b border-[#E2E8F0]">
        <h3 className="text-sm font-semibold text-[#1E293B] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#0F766E]" />
          Probable Root Causes & Likelihood
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Ranked by heuristic analysis and pattern matching
        </p>
      </div>

      <div className="space-y-2">
        {causes.map((c, idx) => {
          const confidence = Math.round(c.confidence * 100);
          return (
            <div
              key={idx}
              className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#CBD5E1] transition-colors"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded bg-white border border-[#CBD5E1] text-[#1E293B] font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 sm:mt-0 shadow-sm">
                  {c.rank || idx + 1}
                </span>
                <span className="text-xs text-[#1E293B] font-medium leading-relaxed">
                  {c.cause}
                </span>
              </div>
              
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <div className="w-24 bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0F766E]"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <span className="font-mono text-xs font-semibold text-[#1E293B] w-9 text-right">
                  {confidence}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
