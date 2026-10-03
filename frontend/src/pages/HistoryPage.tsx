import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  History, 
  Search, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  Terminal
} from 'lucide-react';
import { analysisService } from '../services/analysisService';
import { AnalysisResponse, PageResponse, LANGUAGES } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import { useAuth } from '../context/AuthContext';

export const HistoryPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [pageData, setPageData] = useState<PageResponse<AnalysisResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    loadHistory(currentPage, languageFilter, severityFilter);
  }, [isAuthenticated, currentPage, languageFilter, severityFilter]);

  const loadHistory = async (page: number, lang: string, sev: string) => {
    setIsLoading(true);
    try {
      const data = await analysisService.getHistory(page, 10, lang, sev);
      setPageData(data);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analysis from history?')) return;

    try {
      await analysisService.delete(id);
      loadHistory(currentPage, languageFilter, severityFilter);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-md bg-[#27272A] border border-[#3F3F46] flex items-center justify-center mx-auto text-[#0F766E]">
          <History className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#1E293B]">Sign In to View History</h2>
        <p className="text-xs text-[#64748B]">
          Save, revisit, and search all your past error explanations and fixes anytime.
        </p>
        <div>
          <Link to="/login" className="btn-primary text-xs px-5 py-2">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const filteredItems = (pageData?.content || []).filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.errorName?.toLowerCase().includes(q) ||
      item.whatHappened?.toLowerCase().includes(q) ||
      item.language?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
          <History className="w-5 h-5 text-[#0F766E]" />
          Analysis History & Archive
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Review previous stack trace diagnostics, root-cause reports, and drop-in code fixes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search error titles or causes..."
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={languageFilter}
            onChange={(e) => { setLanguageFilter(e.target.value); setCurrentPage(0); }}
            className="input w-36 text-xs"
          >
            <option value="ALL">All Languages</option>
            {LANGUAGES.filter((l) => l !== 'AUTO').map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(0); }}
            className="input w-36 text-xs"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* List Container */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-xs text-[#64748B]">
            <Loader2 className="w-5 h-5 animate-spin text-[#0F766E] mx-auto mb-2" />
            Loading analysis history...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 text-center text-xs text-[#64748B] space-y-2">
            <Terminal className="w-8 h-8 text-[#CBD5E1] mx-auto" />
            <p>No past analyses match your search criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
                      {item.language}
                    </span>
                    {item.framework && (
                      <span className="px-2 py-0.5 rounded text-xs font-mono text-[#64748B] bg-white border border-[#CBD5E1]">
                        {item.framework}
                      </span>
                    )}
                    <SeverityBadge severity={item.severity} />
                    <span className="text-[11px] text-[#94A3B8]">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#1E293B] truncate">
                    {item.errorName || 'Error Analysis'}
                  </h3>

                  <p className="text-xs text-[#64748B] line-clamp-1">
                    {item.whatHappened || item.rootCause}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate('/analyze', { state: { sample: { input: item.whatHappened || '', language: item.language } } })}
                    className="btn-secondary text-xs px-2.5 py-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Re-open</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 rounded text-[#94A3B8] hover:text-[#DC2626] transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {pageData && pageData.totalPages > 1 && (
          <div className="px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">
              Page {pageData.number + 1} of {pageData.totalPages} ({pageData.totalElements} records)
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={pageData.number === 0}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                className="btn-secondary p-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={pageData.number >= pageData.totalPages - 1}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="btn-secondary p-1 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
