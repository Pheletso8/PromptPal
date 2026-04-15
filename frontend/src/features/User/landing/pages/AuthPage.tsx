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
      let loggedUser;
      if (mode === 'login') {
        loggedUser = await login(email, password);
      } else {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        loggedUser = await register(name, email, password);
      }
      if (loggedUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-brand-primary/5 text-brand-text font-sans flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-primary/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-brand-secondary/10 blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-brand-text mb-1">
            Prompt<span className="text-brand-primary">Pal</span>
          </h1>
          <p className="text-brand-text/50 font-medium text-sm">AI-powered learning for Grade 7</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-50/80 backdrop-blur-md rounded-full p-1.5 mb-10 border border-gray-100 shadow-sm relative">
          {(['login', 'register'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setMode(tab); setError(''); }}
              className={`flex-1 py-3.5 rounded-full text-sm font-bold transition-all relative z-10 ${
                mode === tab ? 'text-white text-shadow-sm' : 'text-brand-text/50 hover:text-brand-text'
              }`}
            >
              {mode === tab && (
                <div className="absolute inset-0 bg-brand-primary rounded-full justify-center flex items-center -z-10 shadow-[0_4px_14px_0_rgba(107,33,168,0.25)] transition-all"></div>
              )}
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-brand-text/50 uppercase tracking-wider block mb-2 px-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Thabo Mokoena"
                className="w-full bg-white/60 backdrop-blur-sm border border-gray-100 rounded-full px-6 py-4 focus:outline-none focus:bg-white focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 transition-all text-brand-text shadow-sm placeholder:text-brand-text/30"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-brand-text/50 uppercase tracking-wider block mb-2 px-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-white/60 backdrop-blur-sm border border-gray-100 rounded-full px-6 py-4 focus:outline-none focus:bg-white focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 transition-all text-brand-text shadow-sm placeholder:text-brand-text/30"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-text/50 uppercase tracking-wider block mb-2 px-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-white/60 backdrop-blur-sm border border-gray-100 rounded-full px-6 py-4 focus:outline-none focus:bg-white focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 transition-all text-brand-text shadow-sm placeholder:text-brand-text/30"
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
            className="w-full bg-brand-primary hover:bg-brand-secondary transition-all py-4 rounded-full font-bold text-sm shadow-[0_4px_14px_0_rgba(107,33,168,0.25)] hover:shadow-[0_6px_20px_rgba(107,33,168,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-white tracking-wide"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AuthPage;
