import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';

const STATS = [
  { label: 'Questions',    value: '25+',   icon: '📚' },
  { label: 'Topics',       value: '6',     icon: '🎯' },
  { label: 'Avg Duration', value: '12 min', icon: '⏱️' },
];

const TOPICS: Array<{ label: string; color: string; bg: string }> = [
  { label: 'Percentages & Change',   color: 'text-brand-500',  bg: 'bg-brand-500/10'  },
  { label: 'Ratios',                 color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
  { label: 'Data Interpretation',    color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Profit & Loss',          color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { label: 'Interest Calculations',  color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { label: 'Multi-step Problems',    color: 'text-red-400',    bg: 'bg-red-500/10'    },
];

const STEPS = [
  '10 randomised banking-style questions per test',
  'Select your answer and navigate freely — change answers anytime before submitting',
  'Submit when ready to see your score, accuracy, and weak areas',
  'Review step-by-step explanations for every question you got wrong',
  'Track your improvement across multiple test attempts',
];

export default function WelcomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* ── Nav ── */}
      <header className="border-b border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏦</span>
            <span className="font-bold text-white">BankReady</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => navigate('/history')} className="btn-ghost text-sm">
              My Progress
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30
                              flex items-center justify-center text-brand-500 font-bold text-sm">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-300 hidden sm:block">{user?.name}</span>
            </div>
            <button onClick={logout} className="btn-ghost text-sm text-gray-600">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-12 animate-fade-in">
        {/* ── Hero ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20
                          text-brand-500 text-xs font-bold px-4 py-2 rounded-full mb-6
                          uppercase tracking-widest">
            Banking Readiness Assessment
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Test Your Banking<br />
            <span className="text-brand-500">Numerical Readiness</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Practice the exact style of questions used in graduate trainee aptitude tests
            at GTBank, Zenith, Access, First Bank, and UBA.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Topics ── */}
        <div className="card p-6 mb-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Topics Covered
          </h3>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <span key={t.label} className={`tag ${t.bg} ${t.color}`}>
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="card p-6 mb-10">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">
            How It Works
          </h3>
          <ol className="space-y-3">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/20
                                 text-brand-500 font-bold text-xs flex items-center
                                 justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* ── CTA ── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/test')} className="btn-primary px-10 py-4 text-base">
            Start Test →
          </button>
          <button onClick={() => navigate('/history')} className="btn-secondary px-10 py-4 text-base">
            View My Progress
          </button>
        </div>
      </main>
    </div>
  );
}
