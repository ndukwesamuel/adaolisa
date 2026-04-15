// import { useEffect, useState, useCallback, useRef } from 'react';
// import { useNavigate, useParams }                   from 'react-router-dom';
// import { useAuth }                                  from '@/store/AuthContext';
// import { useTest }                                  from '@/store/TestContext';
// import { fetchQuestions, submitTest }               from '@/api/client';
// import type { OptionKey, ModuleCategory }           from '@/types';
// import Spinner                                      from '@/components/Spinner';

// const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D'];
// const VALID: ModuleCategory[]  = ['numerical', 'verbal', 'logical'];

// interface ModCfg {
//   label: string; icon: string; totalSecs: number; limit: number;
//   bar: string; selBg: string; selBorder: string; badge: string;
//   timerCol: string; dotActive: string; dotDone: string;
// }

// const MOD_CFG: Record<ModuleCategory, ModCfg> = {
//   numerical: { label:'Numerical Reasoning', icon:'🔢', totalSecs:12*60, limit:10,
//     bar:'bg-brand-500', selBg:'bg-brand-500/20', selBorder:'border-brand-500',
//     badge:'bg-brand-500 border-brand-500 text-white', timerCol:'text-brand-500',
//     dotActive:'bg-brand-500 text-white shadow-lg shadow-brand-500/30', dotDone:'bg-brand-500/25 text-brand-400 hover:bg-brand-500/40' },
//   verbal: { label:'Verbal Reasoning', icon:'📖', totalSecs:10*60, limit:8,
//     bar:'bg-blue-500', selBg:'bg-blue-500/20', selBorder:'border-blue-500',
//     badge:'bg-blue-500 border-blue-500 text-white', timerCol:'text-blue-400',
//     dotActive:'bg-blue-500 text-white shadow-lg shadow-blue-500/30', dotDone:'bg-blue-500/25 text-blue-400 hover:bg-blue-500/40' },
//   logical: { label:'Logical Reasoning', icon:'🧠', totalSecs:10*60, limit:8,
//     bar:'bg-purple-500', selBg:'bg-purple-500/20', selBorder:'border-purple-500',
//     badge:'bg-purple-500 border-purple-500 text-white', timerCol:'text-purple-400',
//     dotActive:'bg-purple-500 text-white shadow-lg shadow-purple-500/30', dotDone:'bg-purple-500/25 text-purple-400 hover:bg-purple-500/40' },
// };

// export default function TestPage() {
//   const { module: mp = 'numerical' } = useParams<{ module: string }>();
//   const module: ModuleCategory = VALID.includes(mp as ModuleCategory) ? (mp as ModuleCategory) : 'numerical';
//   const cfg = MOD_CFG[module];

//   const { user }    = useAuth();
//   const { questions, answers, currentIndex, startTest, answerQuestion, goToQuestion, nextQuestion, prevQuestion, saveResult, getTimeTaken } = useTest();
//   const navigate    = useNavigate();

//   const [pageState,   setPageState]   = useState<'loading'|'ready'|'error'>('loading');
//   const [errorMsg,    setErrorMsg]    = useState('');
//   const [submitting,  setSubmitting]  = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [timeLeft,    setTimeLeft]    = useState(cfg.totalSecs);
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   useEffect(() => {
//     setPageState('loading'); setTimeLeft(cfg.totalSecs);
//     fetchQuestions(module, cfg.limit)
//       .then((data) => { startTest(data.questions, module); setPageState('ready'); })
//       .catch(() => { setErrorMsg('Failed to load questions. Is the backend running?'); setPageState('error'); });
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [module]);

//   useEffect(() => {
//     if (pageState !== 'ready') return;
//     timerRef.current = setInterval(() => {
//       setTimeLeft((t) => { if (t <= 1) { clearInterval(timerRef.current!); doSubmit(true); return 0; } return t - 1; });
//     }, 1000);
//     return () => clearInterval(timerRef.current!);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pageState]);

//   const doSubmit = useCallback(async (force = false) => {
//     if (!force && Object.keys(answers).length < questions.length) { setShowConfirm(true); return; }
//     clearInterval(timerRef.current!); setSubmitting(true);
//     try {
//       const answersArray = questions.map((q) => ({ questionId: q._id, selectedOption: answers[q._id] ?? ('A' as OptionKey) }));
//       const data = await submitTest(user!._id, answersArray, getTimeTaken(), module);
//       saveResult(data.result, data.wrongAnswerDetails); navigate('/results');
//     } catch { setErrorMsg('Submission failed. Please try again.'); setSubmitting(false); }
//   }, [answers, questions, user, getTimeTaken, saveResult, navigate, module]);

//   if (pageState === 'loading') return (
//     <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
//       <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
//       <p className="text-gray-400">Loading {cfg.label} questions...</p>
//     </div>
//   );
//   if (pageState === 'error') return (
//     <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 p-4 text-center">
//       <span className="text-4xl">🔌</span>
//       <h2 className="text-xl font-bold">Connection Error</h2>
//       <p className="text-gray-400 text-sm max-w-xs">{errorMsg}</p>
//       <button onClick={() => navigate('/')} className="btn-secondary mt-2">← Go Home</button>
//     </div>
//   );
//   if (questions.length === 0) return null;

//   const question    = questions[currentIndex];
//   const selected    = answers[question._id] as OptionKey | undefined;
//   const answered    = Object.keys(answers).length;
//   const progressPct = ((currentIndex + 1) / questions.length) * 100;
//   const timerPct    = timeLeft / cfg.totalSecs;
//   const mins        = Math.floor(timeLeft / 60);
//   const secs        = String(timeLeft % 60).padStart(2, '0');
//   const isLastQ     = currentIndex === questions.length - 1;
//   const timerColor  = timerPct > 0.5 ? cfg.timerCol : timerPct > 0.2 ? 'text-yellow-400' : 'text-red-400';
//   const timerBar    = timerPct > 0.5 ? cfg.bar      : timerPct > 0.2 ? 'bg-yellow-400'   : 'bg-red-400';
//   const diffCls     = question.difficulty === 'easy' ? 'tag-green' : question.difficulty === 'hard' ? 'tag-red' : 'tag-yellow';

//   return (
//     <div className="min-h-screen bg-gray-950 flex flex-col">
//       <header className="border-b border-gray-800 px-4 sm:px-6 py-3 flex items-center gap-4">
//         <button onClick={() => navigate('/')} className="btn-ghost text-sm flex-shrink-0">← Exit</button>
//         <div className="flex items-center gap-1.5 flex-shrink-0">
//           <span>{cfg.icon}</span>
//           <span className="text-xs font-semibold text-gray-400 hidden sm:block">{cfg.label}</span>
//         </div>
//         <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
//           <div className={`h-full ${cfg.bar} rounded-full transition-all duration-300`} style={{ width: `${progressPct}%` }} />
//         </div>
//         <span className="text-sm text-gray-400 flex-shrink-0">{currentIndex + 1} / {questions.length}</span>
//         <span className={`font-mono font-bold text-lg flex-shrink-0 tabular-nums ${timerColor}`}>{mins}:{secs}</span>
//       </header>
//       <div className="h-0.5 bg-gray-900">
//         <div className={`h-full ${timerBar} transition-all duration-1000`} style={{ width: `${timerPct * 100}%` }} />
//       </div>

//       <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 animate-fade-in">
//         <div className="card p-6 sm:p-8 mb-6">
//           <div className="flex flex-wrap gap-2 mb-5">
//             <span className={`tag ${diffCls}`}>{question.difficulty}</span>
//             {question.tags.slice(0, 2).map((t) => <span key={t} className="tag tag-blue">{t}</span>)}
//           </div>
//           <p className="text-white text-lg font-medium leading-relaxed whitespace-pre-line">{question.questionText}</p>
//         </div>

//         <div className="space-y-3 mb-8">
//           {OPTION_KEYS.map((key) => {
//             const isSel = selected === key;
//             return (
//               <button key={key} onClick={() => answerQuestion(question._id, key)}
//                 className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-150 font-medium
//                   ${isSel ? `${cfg.selBg} ${cfg.selBorder} text-white` : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800'}`}>
//                 <span className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold border transition-all ${isSel ? cfg.badge : 'border-gray-600 text-gray-500'}`}>
//                   {key}
//                 </span>
//                 <span className="flex-1 text-sm sm:text-base leading-snug">{question.options[key]}</span>
//               </button>
//             );
//           })}
//         </div>

//         <div className="flex items-center justify-between gap-4 mb-8">
//           <button onClick={prevQuestion} disabled={currentIndex === 0} className="btn-secondary">← Prev</button>
//           <span className="text-xs text-gray-600">{answered} of {questions.length} answered</span>
//           {isLastQ
//             ? <button onClick={() => doSubmit(false)} disabled={submitting} className="btn-primary">{submitting ? <><Spinner />Submitting...</> : 'Submit Test ✓'}</button>
//             : <button onClick={nextQuestion} className="btn-primary">Next →</button>}
//         </div>

//         <div className="flex flex-wrap gap-2 justify-center">
//           {questions.map((q, i) => {
//             const isActive   = i === currentIndex;
//             const isAnswered = q._id in answers;
//             return (
//               <button key={q._id} onClick={() => goToQuestion(i)} title={`Q${i + 1}`}
//                 className={`w-8 h-8 rounded-md text-xs font-bold transition-all duration-150
//                   ${isActive ? cfg.dotActive : isAnswered ? cfg.dotDone : 'bg-gray-800 text-gray-500 hover:bg-gray-700'}`}>
//                 {i + 1}
//               </button>
//             );
//           })}
//         </div>
//       </main>

//       {showConfirm && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="card p-6 max-w-sm w-full animate-slide-up">
//             <div className="text-2xl mb-3">⚠️</div>
//             <h3 className="text-lg font-bold text-white mb-2">Submit Test?</h3>
//             <p className="text-gray-400 text-sm mb-6">
//               You have <strong className="text-yellow-400">{questions.length - answered} unanswered question{questions.length - answered !== 1 ? 's' : ''}</strong>. They will be marked incorrect.
//             </p>
//             <div className="flex gap-3">
//               <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1">Go Back</button>
//               <button onClick={() => { setShowConfirm(false); doSubmit(true); }} className="btn-primary flex-1">Submit Anyway</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {errorMsg && pageState === 'ready' && (
//         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium z-50">
//           {errorMsg}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";
import { useTest } from "@/store/TestContext";
import { fetchQuestions, submitTest } from "@/api/client";
import type { OptionKey, ModuleCategory } from "@/types";
import Spinner from "@/components/Spinner";

const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];
const VALID: ModuleCategory[] = ["numerical", "verbal", "logical", "abstract"];

interface ModCfg {
  label: string;
  icon: string;
  totalSecs: number;
  limit: number;
  bar: string;
  selBg: string;
  selBorder: string;
  badge: string;
  timerCol: string;
  dotActive: string;
  dotDone: string;
}

const MOD_CFG: Record<ModuleCategory, ModCfg> = {
  numerical: {
    label: "Numerical Reasoning",
    icon: "🔢",
    totalSecs: 12 * 60,
    limit: 10,
    bar: "bg-brand-500",
    selBg: "bg-brand-500/20",
    selBorder: "border-brand-500",
    badge: "bg-brand-500 border-brand-500 text-white",
    timerCol: "text-brand-500",
    dotActive: "bg-brand-500 text-white shadow-lg shadow-brand-500/30",
    dotDone: "bg-brand-500/25 text-brand-400 hover:bg-brand-500/40",
  },
  verbal: {
    label: "Verbal Reasoning",
    icon: "📖",
    totalSecs: 10 * 60,
    limit: 8,
    bar: "bg-blue-500",
    selBg: "bg-blue-500/20",
    selBorder: "border-blue-500",
    badge: "bg-blue-500 border-blue-500 text-white",
    timerCol: "text-blue-400",
    dotActive: "bg-blue-500 text-white shadow-lg shadow-blue-500/30",
    dotDone: "bg-blue-500/25 text-blue-400 hover:bg-blue-500/40",
  },
  logical: {
    label: "Logical Reasoning",
    icon: "🧠",
    totalSecs: 10 * 60,
    limit: 8,
    bar: "bg-purple-500",
    selBg: "bg-purple-500/20",
    selBorder: "border-purple-500",
    badge: "bg-purple-500 border-purple-500 text-white",
    timerCol: "text-purple-400",
    dotActive: "bg-purple-500 text-white shadow-lg shadow-purple-500/30",
    dotDone: "bg-purple-500/25 text-purple-400 hover:bg-purple-500/40",
  },
  abstract: {
    label: "Abstract Reasoning",
    icon: "🔷",
    totalSecs: 10 * 60,
    limit: 10,
    bar: "bg-orange-500",
    selBg: "bg-orange-500/20",
    selBorder: "border-orange-500",
    badge: "bg-orange-500 border-orange-500 text-white",
    timerCol: "text-orange-400",
    dotActive: "bg-orange-500 text-white shadow-lg shadow-orange-500/30",
    dotDone: "bg-orange-500/25 text-orange-400 hover:bg-orange-500/40",
  },
};

export default function TestPage() {
  const { module: mp = "numerical" } = useParams<{ module: string }>();
  const module: ModuleCategory = VALID.includes(mp as ModuleCategory)
    ? (mp as ModuleCategory)
    : "numerical";
  const cfg = MOD_CFG[module];

  const { user } = useAuth();
  const {
    questions,
    answers,
    currentIndex,
    startTest,
    answerQuestion,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    saveResult,
    getTimeTaken,
  } = useTest();
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(cfg.totalSecs);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPageState("loading");
    setTimeLeft(cfg.totalSecs);
    fetchQuestions(module, cfg.limit)
      .then((data) => {
        startTest(data.questions, module);
        setPageState("ready");
      })
      .catch(() => {
        setErrorMsg("Failed to load questions. Is the backend running?");
        setPageState("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module]);

  useEffect(() => {
    if (pageState !== "ready") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          doSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageState]);

  const doSubmit = useCallback(
    async (force = false) => {
      if (!force && Object.keys(answers).length < questions.length) {
        setShowConfirm(true);
        return;
      }
      clearInterval(timerRef.current!);
      setSubmitting(true);
      try {
        const answersArray = questions.map((q) => ({
          questionId: q._id,
          selectedOption: answers[q._id] ?? ("A" as OptionKey),
        }));
        const data = await submitTest(
          user!._id,
          answersArray,
          getTimeTaken(),
          module,
        );
        saveResult(data.result, data.wrongAnswerDetails);
        navigate("/results");
      } catch {
        setErrorMsg("Submission failed. Please try again.");
        setSubmitting(false);
      }
    },
    [answers, questions, user, getTimeTaken, saveResult, navigate, module],
  );

  if (pageState === "loading")
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading {cfg.label} questions...</p>
      </div>
    );
  if (pageState === "error")
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 p-4 text-center">
        <span className="text-4xl">🔌</span>
        <h2 className="text-xl font-bold">Connection Error</h2>
        <p className="text-gray-400 text-sm max-w-xs">{errorMsg}</p>
        <button onClick={() => navigate("/")} className="btn-secondary mt-2">
          ← Go Home
        </button>
      </div>
    );
  if (questions.length === 0) return null;

  const question = questions[currentIndex];
  const selected = answers[question._id] as OptionKey | undefined;
  const answered = Object.keys(answers).length;
  const progressPct = ((currentIndex + 1) / questions.length) * 100;
  const timerPct = timeLeft / cfg.totalSecs;
  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, "0");
  const isLastQ = currentIndex === questions.length - 1;
  const timerColor =
    timerPct > 0.5
      ? cfg.timerCol
      : timerPct > 0.2
        ? "text-yellow-400"
        : "text-red-400";
  const timerBar =
    timerPct > 0.5 ? cfg.bar : timerPct > 0.2 ? "bg-yellow-400" : "bg-red-400";
  const diffCls =
    question.difficulty === "easy"
      ? "tag-green"
      : question.difficulty === "hard"
        ? "tag-red"
        : "tag-yellow";

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="border-b border-gray-800 px-4 sm:px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="btn-ghost text-sm flex-shrink-0"
        >
          ← Exit
        </button>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span>{cfg.icon}</span>
          <span className="text-xs font-semibold text-gray-400 hidden sm:block">
            {cfg.label}
          </span>
        </div>
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${cfg.bar} rounded-full transition-all duration-300`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-sm text-gray-400 flex-shrink-0">
          {currentIndex + 1} / {questions.length}
        </span>
        <span
          className={`font-mono font-bold text-lg flex-shrink-0 tabular-nums ${timerColor}`}
        >
          {mins}:{secs}
        </span>
      </header>
      <div className="h-0.5 bg-gray-900">
        <div
          className={`h-full ${timerBar} transition-all duration-1000`}
          style={{ width: `${timerPct * 100}%` }}
        />
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 animate-fade-in">
        <div className="card p-6 sm:p-8 mb-6">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`tag ${diffCls}`}>{question.difficulty}</span>
            {question.tags.slice(0, 2).map((t) => (
              <span key={t} className="tag tag-blue">
                {t}
              </span>
            ))}
          </div>
          <p className="text-white text-lg font-medium leading-relaxed whitespace-pre-line">
            {question.questionText}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {OPTION_KEYS.map((key) => {
            const isSel = selected === key;
            return (
              <button
                key={key}
                onClick={() => answerQuestion(question._id, key)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-150 font-medium
                  ${isSel ? `${cfg.selBg} ${cfg.selBorder} text-white` : "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"}`}
              >
                <span
                  className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold border transition-all ${isSel ? cfg.badge : "border-gray-600 text-gray-500"}`}
                >
                  {key}
                </span>
                <span className="flex-1 text-sm sm:text-base leading-snug">
                  {question.options[key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="btn-secondary"
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-600">
            {answered} of {questions.length} answered
          </span>
          {isLastQ ? (
            <button
              onClick={() => doSubmit(false)}
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? (
                <>
                  <Spinner />
                  Submitting...
                </>
              ) : (
                "Submit Test ✓"
              )}
            </button>
          ) : (
            <button onClick={nextQuestion} className="btn-primary">
              Next →
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {questions.map((q, i) => {
            const isActive = i === currentIndex;
            const isAnswered = q._id in answers;
            return (
              <button
                key={q._id}
                onClick={() => goToQuestion(i)}
                title={`Q${i + 1}`}
                className={`w-8 h-8 rounded-md text-xs font-bold transition-all duration-150
                  ${isActive ? cfg.dotActive : isAnswered ? cfg.dotDone : "bg-gray-800 text-gray-500 hover:bg-gray-700"}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </main>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-sm w-full animate-slide-up">
            <div className="text-2xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-white mb-2">Submit Test?</h3>
            <p className="text-gray-400 text-sm mb-6">
              You have{" "}
              <strong className="text-yellow-400">
                {questions.length - answered} unanswered question
                {questions.length - answered !== 1 ? "s" : ""}
              </strong>
              . They will be marked incorrect.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-secondary flex-1"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  doSubmit(true);
                }}
                className="btn-primary flex-1"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && pageState === "ready" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium z-50">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
