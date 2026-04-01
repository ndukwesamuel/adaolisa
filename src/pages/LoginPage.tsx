import React, { useState, useEffect } from 'react';
import { useNavigate }                from 'react-router-dom';
import { useAuth }                    from '@/store/AuthContext';
import { loginUser, listUsers }       from '@/api/client';
import type { SeededUser }            from '@/types';
import Spinner                        from '@/components/Spinner';

const AVATAR_COLORS = [
  'bg-brand-500/20 text-brand-500', 'bg-blue-500/20 text-blue-400',
  'bg-purple-500/20 text-purple-400', 'bg-orange-500/20 text-orange-400', 'bg-pink-500/20 text-pink-400',
];

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [email,        setEmail]        = useState('');
  const [name,         setName]         = useState('');
  const [loading,      setLoading]      = useState(false);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);
  const [error,        setError]        = useState('');
  const [seededUsers,  setSeededUsers]  = useState<SeededUser[]>([]);

  useEffect(() => { listUsers().then((d) => setSeededUsers(d.users)).catch(() => {}); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true);
    try {
      const data = await loginUser(email.trim(), name.trim() || undefined);
      login(data.user); navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login failed.';
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleQuickLogin = async (u: SeededUser) => {
    setError(''); setQuickLoading(u._id);
    try { const data = await loginUser(u.email); login(data.user); navigate('/'); }
    catch { setError('Quick login failed. Is the backend running?'); }
    finally { setQuickLoading(null); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-500/20 rounded-2xl mb-4 border border-brand-500/20">
            <span className="text-3xl">🏦</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">BankReady</h1>
          <p className="text-gray-400 mt-2 text-sm">Graduate Aptitude Practice for Banking Careers</p>
        </div>

        <div className="card p-8 mb-4">
          <h2 className="text-base font-semibold text-white mb-5">Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Full Name <span className="text-gray-600 text-xs">(only for new accounts)</span>
              </label>
              <input className="input" type="text" placeholder="Your full name"
                value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? <><Spinner />Signing in...</> : 'Continue →'}
            </button>
          </form>
        </div>

        {seededUsers.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider whitespace-nowrap">Demo Accounts</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <p className="text-xs text-gray-500 text-center mb-4">Click any account to log in instantly</p>
            <div className="space-y-2">
              {seededUsers.map((u, i) => {
                const isLoading = quickLoading === u._id;
                return (
                  <button key={u._id} onClick={() => handleQuickLogin(u)} disabled={!!quickLoading}
                    className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-800/50 hover:bg-gray-800
                               border border-gray-700/50 hover:border-gray-600 rounded-xl transition-all
                               duration-150 group disabled:opacity-60 disabled:cursor-not-allowed">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                      {isLoading ? <Spinner size={14} /> : u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors truncate">{u.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate">{u.email}</div>
                    </div>
                    <span className="flex-shrink-0 text-gray-600 group-hover:text-brand-500 transition-colors">→</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
