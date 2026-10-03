import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, User, Loader2, MessageSquare } from 'lucide-react';
import { FollowUpMessage } from '../types';
import { analysisService } from '../services/analysisService';

interface FollowUpChatProps {
  analysisId?: number;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({ analysisId }) => {
  const [messages, setMessages] = useState<FollowUpMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (analysisId) {
      analysisService.getFollowUps(analysisId)
        .then((res) => setMessages(res))
        .catch(() => {});
    }
  }, [analysisId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !analysisId || isLoading) return;

    const userMsg: FollowUpMessage = {
      role: 'USER',
      message: question.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQ = question;
    setQuestion('');
    setIsLoading(true);
    setError(null);

    try {
      const aiReply = await analysisService.askFollowUp(analysisId, currentQ);
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      setError(err.message || 'Failed to get answer. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'How do I reproduce this in a unit test?',
    'What are the edge cases with this fix?',
    'Can this error happen in production only?',
    'Show an alternative fix without third-party libraries'
  ];

  if (!analysisId) {
    return (
      <div className="card p-8 text-center text-[#64748B] text-xs">
        Run an analysis first to ask contextual follow-up questions.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden flex flex-col h-[520px] shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white border border-[#CBD5E1] text-[#0F766E] flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#1E293B]">Contextual Follow-Up Assistant</h4>
            <p className="text-[11px] text-[#64748B]">Ask questions scoped to this exact stack trace and fix</p>
          </div>
        </div>
      </div>

      {/* Message history */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FFFFFF]">
        {messages.length === 0 && (
          <div className="text-center py-8 space-y-3">
            <Terminal className="w-7 h-7 text-[#94A3B8] mx-auto" />
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Ask follow-up questions to understand nuances, edge-cases, reproduction steps, or testing.
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-md mx-auto pt-2">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setQuestion(p)}
                  className="text-xs px-2.5 py-1 rounded bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] hover:border-[#0F766E] transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, idx) => {
          const isUser = m.role === 'USER';
          return (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0 mt-0.5">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-md px-3.5 py-2.5 text-xs ${
                  isUser
                    ? 'bg-[#18181B] text-[#E4E4E7]'
                    : 'bg-[#F8FAFC] text-[#1E293B] border border-[#E2E8F0]'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.message}</div>
                {m.createdAt && (
                  <div className={`text-[10px] mt-1 ${isUser ? 'text-[#71717A]' : 'text-[#94A3B8]'}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded bg-[#E2E8F0] text-[#1E293B] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#64748B] pt-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#0F766E]" />
            <span>Analyzing contextual follow-up...</span>
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-md bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs">
            {error}
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a follow-up question (e.g., 'How to write a pytest unit test for this?')..."
          className="input flex-1 text-xs"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="btn-primary px-3 text-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
