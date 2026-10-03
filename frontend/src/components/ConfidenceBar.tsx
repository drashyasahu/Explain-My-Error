import React from 'react';

interface ConfidenceBarProps {
  confidence?: number;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence = 85 }) => {
  const percentage = Math.min(Math.max(Math.round(confidence), 0), 100);

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs text-[#64748B] font-medium">Confidence:</span>
      <div className="w-24 bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 bg-[#0F766E]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-mono font-bold text-[#1E293B]">
        {percentage}%
      </span>
    </div>
  );
};
