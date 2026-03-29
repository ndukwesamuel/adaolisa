import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '@/store/TestContext';
import type { WrongAnswerDetail } from '@/types';

export default function ResultsPage() {
  const { result, wrongAnswerDetails, resetTest } = useTest();
  const navigate = useNavigate();
  const [reviewOpen, setReviewOpen] = useState(false);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">No results found.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
      </div>
    );
  }

  const { score, totalQuestions, accuracy, timeTaken, weakAreas } = result;
  const mins  = Math.floor(timeTaken / 60);
  const secs  = String(timeTaken % 60).padStart(2, '0');

  const grade =
    accuracy >= 80 ? 'Excellent!' :
    accuracy >= 60 ? 'Good Job!'  :
    accuracy >= 40 ? 'Fair'       : 'Needs Work';

  const gradeColor =
    accuracy >= 80 ? 'text-brand-500' :
    accuracy >= 60 ? 'text-blue-400'  :
    accuracy >= 40 ? 'text-yellow-400': 'text-red-400';

  const ringStroke =
    accuracy >= 80 ? '#22c55e' :
    accuracy >= 60 ? '#60a5fa' :
    accuracy >= 40 ? '#facc15' : '#f87171';

  const circumference = 2 * Math.PI * 54;
  const dashOffset    = circumference * (1 - accuracy / 100);

  const handleRetake = () => {
    resetTest();
    navigate('/test');
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-16">
      {/* ── Header ── */}
      <header className="border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="btn-ghost text-sm">← Home</button>
        <span className="font-semibold text-white">Test Results</span>
        <button onClick={() => navigate('/history')} className="btn-ghost text-sm">History</button>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-10 animate-slide-up">

        {/* ── Score ring ── */}
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center mb-5">
            <svg width="148" height="148" className="-rotate-90">
              <circle cx="74" cy="74" r="54" stroke="#1f2937" strokeWidth="10" fill="none" />
              <circle
                cx="74" cy="74" r="54"
                stroke={ringStroke}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-4xl font-extrabold text-white">{accuracy}%</div>
              <div className="text-xs text-gray-500 mt-0.5">Accuracy</div>
            </div>
          </div>
          <h2 className={`text-2xl font-bold ${gradeColor}`}>{grade}</h2>
          <p className="text-gray-400 mt-1 text-sm">
            You scored{' '}
            <strong className="text-white">{score} out of {totalQuestions}</strong>
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Score',     value: `${score}/${totalQuestions}`, icon: '🎯' },
            { label: 'Accuracy',  value: `${accuracy}%`,               icon: '📊' },
            { label: 'Time Taken',value: `${mins}m ${secs}s`,          icon: '⏱️' },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Weak areas ── */}
        {weakAreas.length > 0 && (
          <div className="card p-6 mb-6 border-l-4 border-yellow-500/70">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span>⚠️</span> Areas to Improve
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              You missed the most questions in these topics:
            </p>
            <div className="flex flex-wrap gap-2">
              {weakAreas.map((area) => (
                <span key={area} className="tag tag-yellow">{area}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Wrong answer review ── */}
        {wrongAnswerDetails.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => setReviewOpen((o) => !o)}
              className="w-full card p-5 flex items-center justify-between
                         hover:bg-gray-800 transition-colors duration-150 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📖</span>
                <div>
                  <div className="text-white font-semibold text-sm">Review Wrong Answers</div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    {wrongAnswerDetails.length} question{wrongAnswerDetails.length !== 1 ? 's' : ''}{' '}
                    with step-by-step explanations
                  </div>
                </div>
              </div>
              <span className="text-gray-500">{reviewOpen ? '▲' : '▼'}</span>
            </button>

            {reviewOpen && (
              <div className="mt-3 space-y-4 animate-fade-in">
                {wrongAnswerDetails.map((item: WrongAnswerDetail, i) => (
                  <div
                    key={item.questionId}
                    className="card p-6 border-l-4 border-red-500/40"
                  >
                    <p className="text-white text-sm font-medium leading-relaxed whitespace-pre-line mb-4">
                      {i + 1}. {item.questionText}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="tag tag-red">Your answer: {item.yourAnswer}</span>
                      <span className="tag tag-green">Correct: {item.correctAnswer}</span>
                    </div>
                    <div className="bg-gray-800/60 rounded-xl p-4 mb-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Step-by-step Explanation
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((t) => (
                          <span key={t} className="tag tag-blue">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={handleRetake} className="btn-primary flex-1 py-4 text-base">
            Retake Test →
          </button>
          <button onClick={() => navigate('/history')} className="btn-secondary flex-1 py-4 text-base">
            View My Progress
          </button>
        </div>
      </main>
    </div>
  );
}
