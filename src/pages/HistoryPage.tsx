import { useEffect, useState }  from 'react';
import { useNavigate }           from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, type TooltipProps } from 'recharts';
import { useAuth }               from '@/store/AuthContext';
import { fetchHistory }          from '@/api/client';
import type { HistoryResponse, HistoryAttempt, ModuleCategory } from '@/types';

type TabId = ModuleCategory | 'all';
interface Tab { id: TabId; label: string; icon: string; color: string; }

const TABS: Tab[] = [
  { id: 'all',       label: 'All',       icon: '📋', color: '#22c55e' },
  { id: 'numerical', label: 'Numerical', icon: '🔢', color: '#22c55e' },
  { id: 'verbal',    label: 'Verbal',    icon: '📖', color: '#60a5fa' },
  { id: 'logical',   label: 'Logical',   icon: '🧠', color: '#a78bfa' },
];

const MOD_ICONS: Record<ModuleCategory, string> = { numerical: '🔢', verbal: '📖', logical: '🧠' };

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm shadow-xl"><p className="text-brand-400 font-bold">{payload[0].value}% accuracy</p></div>;
}

function fmtTime(s: number) { return `${Math.floor(s/60)}m ${String(s%60).padStart(2,'0')}s`; }
function fmtDate(iso: string) { return new Date(iso).toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' }); }
function accColor(a: number) { return a>=80?'text-brand-500':a>=60?'text-blue-400':a>=40?'text-yellow-400':'text-red-400'; }
function accBar(a: number)   { return a>=80?'bg-brand-500':a>=60?'bg-blue-400':a>=40?'bg-yellow-400':'bg-red-400'; }

export default function HistoryPage() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [data,      setData]      = useState<HistoryResponse | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    setLoading(true);
    fetchHistory(user!._id, activeTab === 'all' ? null : activeTab as ModuleCategory)
      .then(setData).catch(() => setError('Failed to load history.')).finally(() => setLoading(false));
  }, [user, activeTab]);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Loading your progress...</p>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 p-4 text-center">
      <span className="text-4xl">😕</span><p className="text-gray-400">{error}</p>
      <button onClick={() => navigate('/')} className="btn-secondary">← Home</button>
    </div>
  );

  const history       = data?.history ?? [];
  const trend         = data?.trend ?? null;
  const totalAttempts = data?.totalAttempts ?? 0;
  const lastAttempt   = history[history.length - 1] as HistoryAttempt | undefined;
  const lineColor     = TABS.find((t) => t.id === activeTab)?.color ?? '#22c55e';
  const chartData     = history.map((h) => ({ name: `Test ${h.attemptNumber}`, accuracy: h.accuracy }));

  return (
    <div className="min-h-screen bg-gray-950 pb-16">
      <header className="border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="btn-ghost text-sm">← Home</button>
        <span className="font-semibold text-white">My Progress</span>
        <button onClick={() => navigate('/')} className="btn-primary text-sm px-4 py-2">New Test</button>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-10 animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-500 font-bold text-2xl">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-sm text-gray-500">{totalAttempts} test{totalAttempts !== 1 ? 's' : ''} completed</p>
          </div>
        </div>

        {/* Module tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-150 flex-shrink-0 border
                ${activeTab === t.id ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border-gray-800'}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {totalAttempts === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">No tests yet</h3>
            <p className="text-gray-400 text-sm mb-6">Take your first test to start tracking your progress.</p>
            <button onClick={() => navigate('/')} className="btn-primary px-8 py-3">Start First Test →</button>
          </div>
        ) : (
          <>
            {trend && (
              <div className={`card p-5 mb-6 flex items-center gap-4 border-l-4 ${trend.improving ? 'border-brand-500' : 'border-yellow-500'}`}>
                <span className="text-3xl flex-shrink-0">{trend.improving ? '📈' : '📉'}</span>
                <div>
                  <div className="text-white font-semibold">
                    {trend.improving ? `Improving! +${trend.change}% since your first test` : `Down ${Math.abs(trend.change)}% — keep practising!`}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    First: <strong className="text-white">{trend.firstAttemptAccuracy}%</strong>
                    {' → '}Latest: <strong className={accColor(trend.latestAttemptAccuracy)}>{trend.latestAttemptAccuracy}%</strong>
                  </div>
                </div>
              </div>
            )}

            {chartData.length >= 2 && (
              <div className="card p-6 mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Accuracy Over Time</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData} margin={{ top:5, right:10, bottom:5, left:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" tick={{ fill:'#6b7280', fontSize:12 }} axisLine={{ stroke:'#374151' }} tickLine={false} />
                    <YAxis domain={[0,100]} tick={{ fill:'#6b7280', fontSize:12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke:'#374151' }} />
                    <ReferenceLine y={60} stroke="#374151" strokeDasharray="4 2" label={{ value:'Pass', fill:'#6b7280', fontSize:11 }} />
                    <Line type="monotone" dataKey="accuracy" stroke={lineColor} strokeWidth={2.5}
                      dot={{ fill:lineColor, r:5, strokeWidth:0 }} activeDot={{ r:7, fill:lineColor }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="space-y-3 mb-8">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">All Attempts</h3>
              {[...history].reverse().map((attempt) => {
                const isLatest = attempt._id === lastAttempt?._id;
                const modIcon  = MOD_ICONS[attempt.module] ?? '📋';
                return (
                  <div key={attempt._id} className={`card p-5 ${isLatest ? 'border-brand-500/30' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{modIcon}</span>
                        <span className="text-white font-semibold">Test {attempt.attemptNumber}</span>
                        {isLatest && <span className="tag tag-green">Latest</span>}
                      </div>
                      <span className={`text-2xl font-bold font-mono ${accColor(attempt.accuracy)}`}>{attempt.accuracy}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full transition-all ${accBar(attempt.accuracy)}`} style={{ width:`${attempt.accuracy}%` }} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span>🎯 {attempt.score}/{attempt.totalQuestions} correct</span>
                      <span>⏱️ {fmtTime(attempt.timeTaken)}</span>
                      <span>📅 {fmtDate(attempt.createdAt)}</span>
                    </div>
                    {attempt.weakAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="text-xs text-gray-600 self-center">Weak areas:</span>
                        {attempt.weakAreas.map((a) => <span key={a} className="tag tag-yellow">{a}</span>)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={() => navigate('/')} className="btn-primary w-full py-4 text-base">Take Another Test →</button>
          </>
        )}
      </main>
    </div>
  );
}
