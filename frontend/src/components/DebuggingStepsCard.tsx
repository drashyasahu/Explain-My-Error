import React, { useState } from 'react';
import { ListChecks, CheckSquare, Square } from 'lucide-react';

interface DebuggingStepsProps {
  steps?: string[];
}

export const DebuggingStepsCard: React.FC<DebuggingStepsProps> = ({ steps = [] }) => {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  if (!steps || steps.length === 0) return null;

  const toggleStep = (idx: number) => {
    setCompleted((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <h3 className="text-sm font-semibold text-[#1E293B] flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-[#0F766E]" />
          Step-by-Step Debugging Checklist
        </h3>
        <span className="text-xs font-mono text-[#64748B]">
          {completedCount} of {steps.length} completed
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isDone = !!completed[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`p-3 rounded-md border cursor-pointer transition-colors duration-150 flex items-start gap-3 select-none ${
                isDone
                  ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                  : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-[#0F766E] shrink-0"
              >
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-[#15803D]" />
                ) : (
                  <Square className="w-4 h-4 text-[#94A3B8]" />
                )}
              </button>
              <div className="flex-1 text-xs">
                <span className="font-mono text-[#64748B] mr-2">Step {idx + 1}:</span>
                <span className={isDone ? 'line-through text-[#64748B]' : 'text-[#1E293B] font-medium'}>
                  {step}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
