/**
 * AuthPage.tsx
 * 
 * A combined Login / Register page.
 * - Toggles between two forms with a tab UI.
 * - On success, redirects to /home.
 * - Shows validation errors returned from the backend.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        await register(name, email, password);
      }
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-brand-text">
            Prompt<span className="text-brand-primary">Pal</span>
          </h1>
          <p className="text-brand-text/50 text-sm mt-2">AI-powered learning for Grade 7</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-brand-secondary/10 rounded-2xl p-1 mb-8 border border-brand-primary/10">
          {(['login', 'register'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setMode(tab); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                mode === tab ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-brand-text/50 hover:text-brand-primary'
              }`}
            >
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-brand-text/40 uppercase tracking-widest block mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Thabo Mokoena"
                className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-primary/60 transition-all text-brand-text"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-brand-text/40 uppercase tracking-widest block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-primary/60 transition-all text-brand-text"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-text/40 uppercase tracking-widest block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-primary/60 transition-all text-brand-text"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:opacity-90 transition-all py-4 rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-white"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
