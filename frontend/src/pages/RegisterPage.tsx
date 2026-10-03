import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate('/analyze');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-6">
      <div className="text-center space-y-1.5">
        <div className="w-10 h-10 rounded-md bg-[#18181B] border border-[#27272A] text-[#0F766E] flex items-center justify-center mx-auto">
          <Terminal className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-[#1E293B]">Create Developer Account</h1>
        <p className="text-xs text-[#64748B]">Join ExplainMyError to persist diagnoses and debug sessions</p>
      </div>

      <div className="card p-6 space-y-4 shadow-sm">
        {errorMsg && (
          <div className="p-3 rounded-md bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              className="input text-xs"
              required
            />
          </div>

          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
              className="input text-xs"
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input text-xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim() || !name.trim()}
            className="btn-primary w-full text-xs py-2.5 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0F766E] hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
