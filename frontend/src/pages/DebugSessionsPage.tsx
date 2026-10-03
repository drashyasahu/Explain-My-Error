import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Layers, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Trash2, 
  Send, 
  Terminal, 
  Check 
} from 'lucide-react';
import { debugSessionService } from '../services/debugSessionService';
import { DebugSession, SessionEntry } from '../types';
import { useAuth } from '../context/AuthContext';

export const DebugSessionsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id');
  const { isAuthenticated } = useAuth();

  const [sessions, setSessions] = useState<DebugSession[]>([]);
  const [currentSession, setCurrentSession] = useState<DebugSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New session modal / form
  const [newTitle, setNewTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Add step form
  const [userInput, setUserInput] = useState('');
  const [stepStatus, setStepStatus] = useState<string>('NEW_ERROR');
  const [resolutionNote, setResolutionNote] = useState('');
  const [isAddingStep, setIsAddingStep] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    loadSessions();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedId && sessions.length > 0) {
      const found = sessions.find((s) => s.id === Number(selectedId));
      if (found) {
        loadSessionDetails(found.id);
      }
    } else if (sessions.length > 0 && !selectedId) {
      loadSessionDetails(sessions[0].id);
    }
  }, [selectedId, sessions]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await debugSessionService.getAll();
      setSessions(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch debug sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionDetails = async (id: number) => {
    try {
      const data = await debugSessionService.getById(id);
      setCurrentSession(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await debugSessionService.create({ title: newTitle.trim() });
      setSessions((prev) => [created, ...prev]);
      setCurrentSession(created);
      setSearchParams({ id: created.id.toString() });
      setNewTitle('');
      setShowCreateModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create session');
    }
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession || !userInput.trim() || isAddingStep) return;

    setIsAddingStep(true);
    try {
      await debugSessionService.addStep(currentSession.id, {
        userInput: userInput.trim(),
        stepStatus,
        resolutionNote: resolutionNote.trim() || undefined
      });
      await loadSessionDetails(currentSession.id);
      setUserInput('');
      setResolutionNote('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to append step');
    } finally {
      setIsAddingStep(false);
    }
  };

  const handleResolveSession = async () => {
    if (!currentSession) return;
    try {
      const updated = await debugSessionService.updateStatus(currentSession.id, 'RESOLVED');
      setCurrentSession(updated);
      setSessions((prev) => prev.map((s) => s.id === updated.id ? updated : s));
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteSession = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this debug session?')) return;
    try {
      await debugSessionService.delete(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (currentSession?.id === id) {
        setCurrentSession(null);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-md bg-[#27272A] border border-[#3F3F46] flex items-center justify-center mx-auto text-[#0F766E]">
          <Layers className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#1E293B]">Sign In to Track Debug Sessions</h2>
        <p className="text-xs text-[#64748B]">
          Multi-turn debugging sessions preserve your investigation context when one error leads to another.
        </p>
        <div>
          <Link to="/login" className="btn-primary text-xs px-5 py-2">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0F766E]" />
            Multi-Turn Debugging Sessions
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Maintain full contextual memory across iterative code attempts and cascading error chains.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="btn-primary text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Debug Session</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Sessions List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider px-1">
            Active & Past Sessions ({sessions.length})
          </div>

          <div className="space-y-2">
            {isLoading && (
              <div className="p-8 text-center text-xs text-[#64748B]">
                <Loader2 className="w-4 h-4 animate-spin text-[#0F766E] mx-auto mb-2" />
                Loading sessions...
              </div>
            )}

            {!isLoading && sessions.length === 0 && (
              <div className="card p-6 text-center text-xs text-[#64748B] space-y-2">
                <p>No debug sessions created yet.</p>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="text-xs text-[#0F766E] hover:underline font-medium"
                >
                  Create your first session
                </button>
              </div>
            )}

            {sessions.map((s) => {
              const isSelected = currentSession?.id === s.id;
              const isResolved = s.status === 'RESOLVED';
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setCurrentSession(s);
                    setSearchParams({ id: s.id.toString() });
                  }}
                  className={`p-3.5 rounded-md border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-white border-[#0F766E] shadow-sm'
                      : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {isResolved ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                        )}
                        <h4 className="text-xs font-semibold text-[#1E293B] truncate max-w-[200px]">
                          {s.title}
                        </h4>
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {s.entries?.length || 0} turn(s) • {new Date(s.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className="p-1 rounded text-[#94A3B8] hover:text-[#DC2626] transition-colors"
                      title="Delete session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Session Detail & Timeline */}
        <div className="lg:col-span-8 space-y-4">
          {currentSession ? (
            <div className="space-y-4">
              
              {/* Session Overview Header */}
              <div className="card p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        currentSession.status === 'RESOLVED'
                          ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                          : 'bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1]'
                      }`}>
                        {currentSession.status}
                      </span>
                      <span className="text-xs text-[#64748B]">
                        Session #{currentSession.id}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-[#1E293B]">
                      {currentSession.title}
                    </h2>
                  </div>

                  {currentSession.status !== 'RESOLVED' && (
                    <button
                      type="button"
                      onClick={handleResolveSession}
                      className="btn-secondary text-xs px-3 py-1.5 self-start sm:self-center"
                    >
                      <Check className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>

                <div className="text-xs text-[#64748B]">
                  Created {new Date(currentSession.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Timeline Turns */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider px-1">
                  Investigation Timeline ({currentSession.entries?.length || 0} Steps)
                </div>

                {currentSession.entries?.map((entry: SessionEntry, idx: number) => (
                  <div key={idx} className="card p-5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] font-mono text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-[#1E293B]">
                          Turn #{idx + 1} ({entry.stepStatus || 'NEW_ERROR'})
                        </span>
                      </div>
                      <span className="text-[11px] text-[#94A3B8]">
                        {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Input Dump */}
                    {entry.userInput && (
                      <div className="editor-wrapper">
                        <div className="editor-header px-3 py-1 text-[11px] font-mono">
                          // Error Trace / Code at Step {idx + 1}
                        </div>
                        <pre className="p-3 text-xs font-mono text-[#E4E4E7] overflow-x-auto dark-scroll whitespace-pre leading-relaxed">
                          {entry.userInput}
                        </pre>
                      </div>
                    )}

                    {/* Analysis Summary if present */}
                    {entry.analysis && (
                      <div className="p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs">
                        <div className="font-semibold text-[#1E293B] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
                          Diagnosis & Recommended Fix
                        </div>
                        <p className="text-[#64748B] leading-relaxed">
                          {entry.analysis.whatHappened || entry.analysis.rootCause}
                        </p>
                        {entry.analysis.suggestedFix?.explanation && (
                          <p className="text-[#1E293B] font-medium pt-1">
                            Fix: {entry.analysis.suggestedFix.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Next Step Form */}
              {currentSession.status !== 'RESOLVED' && (
                <form onSubmit={handleAddStep} className="card p-5 space-y-3">
                  <div className="pb-2 border-b border-[#E2E8F0]">
                    <h3 className="text-xs font-semibold text-[#1E293B] uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#0F766E]" />
                      Append Next Step / Follow-on Error
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Did the suggested fix introduce another error? Paste it below to continue the multi-turn session.
                    </p>
                  </div>

                  <div className="editor-wrapper">
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="// Paste subsequent stack trace or code snippet here..."
                      rows={5}
                      className="w-full bg-[#18181B] p-3 font-mono text-xs text-[#E4E4E7] placeholder-[#71717A] focus:outline-none border-none dark-scroll"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <select
                      value={stepStatus}
                      onChange={(e) => setStepStatus(e.target.value)}
                      className="input w-48 text-xs py-1.5"
                    >
                      <option value="NEW_ERROR">Subsequent Error</option>
                      <option value="ATTEMPTED_FIX">Attempted Fix Attempt</option>
                      <option value="PARTIAL_SUCCESS">Partial Success</option>
                    </select>

                    <button
                      type="submit"
                      disabled={isAddingStep || !userInput.trim()}
                      className="btn-primary text-xs"
                    >
                      {isAddingStep ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Append Turn</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          ) : (
            <div className="card p-12 text-center text-xs text-[#64748B] space-y-2">
              <Layers className="w-8 h-8 text-[#CBD5E1] mx-auto" />
              <p>Select a debug session from the left or create a new one.</p>
            </div>
          )}
        </div>

      </div>

      {/* New Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-none flex items-center justify-center p-4">
          <div className="card p-6 max-w-md w-full space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-[#1E293B]">Create Debugging Session</h3>
            <form onSubmit={handleCreateSession} className="space-y-3">
              <div>
                <label className="label">Session Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. FastAPI Postgres Connection Timeout"
                  className="input text-xs"
                  required
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
