import React, { useState } from 'react';
import { User, Settings, Save, Check, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES, EXPLANATION_LEVELS } from '../types';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  const [preferredLevel, setPreferredLevel] = useState(user?.preferredExplanationLevel || 'INTERMEDIATE');
  const [defaultLanguage, setDefaultLanguage] = useState(user?.defaultLanguage || 'AUTO');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = {
        ...user,
        preferredExplanationLevel: preferredLevel,
        defaultLanguage
      };
      localStorage.setItem('eme_user', JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#0F766E]" />
          Developer Preferences & Configuration
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Customize your default diagnostic depth, primary language, and developer account details.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Developer Profile Card */}
        <div className="card p-5 space-y-4">
          <div className="pb-2 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-[#1E293B] flex items-center gap-2">
              <User className="w-4 h-4 text-[#0F766E]" />
              Developer Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="label">Name</span>
              <p className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] font-mono">
                {user?.name || 'Guest Developer'}
              </p>
            </div>
            <div>
              <span className="label">Email Address</span>
              <p className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] font-mono">
                {user?.email || 'guest@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Diagnostic Preferences Card */}
        <div className="card p-5 space-y-4">
          <div className="pb-2 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-[#1E293B]">Diagnostic Defaults</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Default Explanation Level</label>
              <select
                value={preferredLevel}
                onChange={(e) => setPreferredLevel(e.target.value)}
                className="input text-xs"
              >
                {EXPLANATION_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl.charAt(0) + lvl.slice(1).toLowerCase()} — {lvl === 'BEGINNER' ? 'Plain English concepts & step-by-step guidance' : lvl === 'INTERMEDIATE' ? 'Balanced technical depth & code fixes' : 'Deep architectural, memory & compiler semantics'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Default Primary Language</label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="input text-xs"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === 'AUTO' ? 'Auto-Detect Language (Recommended)' : lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Security & Data Retention Card */}
        <div className="card p-5 space-y-2">
          <h3 className="text-sm font-semibold text-[#1E293B] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0F766E]" />
            Privacy & Zero-Retention Policy
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            All code snippets and stack traces sent to ExplainMyError are processed ephemerally using your local Ollama instance or strict private enterprise models. No developer code is ever used for AI training.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary text-xs"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Preferences Saved</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
};
