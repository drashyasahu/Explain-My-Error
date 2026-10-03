import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface SeverityBadgeProps {
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'INFO' | string;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '' }) => {
  const sev = (severity || 'MEDIUM').toUpperCase();

  if (sev === 'CRITICAL' || sev === 'HIGH') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
        <span>{sev === 'CRITICAL' ? 'Critical Severity' : 'High Severity'}</span>
      </span>
    );
  }

  if (sev === 'MEDIUM' || sev === 'WARNING') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
        <span>Medium Severity</span>
      </span>
    );
  }

  if (sev === 'LOW' || sev === 'SUCCESS') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
        <span>Low Severity</span>
      </span>
    );
  }

  // Default / INFO
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] ${className}`}>
      <Info className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
      <span>Info / Notice</span>
    </span>
  );
};
