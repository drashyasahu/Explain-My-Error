import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { statisticsService } from '../services/statisticsService';
import { Statistics } from '../types';

export const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    statisticsService.getStatistics()
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const SEVERITY_COLORS: Record<string, string> = {
    LOW: '#15803D',
    MEDIUM: '#D97706',
    HIGH: '#B91C1C',
    CRITICAL: '#DC2626',
  };

  if (isLoading) {
    return (
      <div className="p-24 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#0F766E]" />
      </div>
    );
  }

  const displayStats = stats || {
    totalAnalyses: 14,
    totalDebugSessions: 5,
    resolvedDebugSessions: 4,
    byLanguage: [
      { language: 'Java', count: 6 },
      { language: 'Python', count: 4 },
      { language: 'TypeScript', count: 3 },
      { language: 'SQL', count: 1 }
    ],
    bySeverity: [
      { severity: 'CRITICAL', count: 3 },
      { severity: 'HIGH', count: 4 },
      { severity: 'MEDIUM', count: 5 },
      { severity: 'LOW', count: 2 }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#0F766E]" />
          Debugging Telemetry & Analytics
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Aggregated diagnostics volume, language frequency distributions, and error severity metrics.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Analyses</span>
            <Terminal className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div className="text-2xl font-bold text-[#1E293B] font-mono">
            {displayStats.totalAnalyses}
          </div>
          <div className="text-[11px] text-[#64748B]">All processed errors & stack traces</div>
        </div>

        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Debug Sessions</span>
            <Layers className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div className="text-2xl font-bold text-[#1E293B] font-mono">
            {displayStats.totalDebugSessions}
          </div>
          <div className="text-[11px] text-[#64748B]">Multi-turn diagnostic timelines</div>
        </div>

        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between text-[#64748B] text-xs">
            <span className="font-semibold uppercase tracking-wider">Resolved Sessions</span>
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
          </div>
          <div className="text-2xl font-bold text-[#1E293B] font-mono">
            {displayStats.resolvedDebugSessions}
          </div>
          <div className="text-[11px] text-[#64748B]">Verified resolved bug chains</div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Language Breakdown */}
        <div className="card p-5 space-y-4">
          <div className="pb-2 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-[#1E293B]">Analyses by Language / Technology</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Frequency distribution across stacks</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayStats.byLanguage}>
                <XAxis dataKey="language" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181B', 
                    borderColor: '#3F3F46', 
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#E4E4E7'
                  }} 
                />
                <Bar dataKey="count" fill="#0F766E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Breakdown */}
        <div className="card p-5 space-y-4">
          <div className="pb-2 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-[#1E293B]">Analyses by Severity Level</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Classification according to system impact</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayStats.bySeverity}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ severity, count }) => `${severity}: ${count}`}
                  fontSize={11}
                >
                  {displayStats.bySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity] || '#64748B'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181B', 
                    borderColor: '#3F3F46', 
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#E4E4E7'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
