import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";
import { useTest } from "@/store/TestContext";
import { fetchQuestions, submitTest } from "@/api/client";
import type { OptionKey } from "@/types";
import Spinner from "@/components/Spinner";

const TOTAL_SECONDS = 12 * 60; // 12 minutes
const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

export default function TestPage() {
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
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load questions once
  useEffect(() => {
    fetchQuestions(10)
      .then((data) => {
        startTest(data.questions);
        setPageState("ready");
      })
      .catch(() => {
        setErrorMsg(
          "Failed to load questions. Is the backend running on port 5000?",
        );
        setPageState("error");
      });
  }, [startTest]);

  // Countdown timer
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
  }, [pageState]); // eslint-disable-line react-hooks/exhaustive-deps

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
        const data = await submitTest(user!._id, answersArray, getTimeTaken());
        saveResult(data.result, data.wrongAnswerDetails);
        navigate("/results");
      } catch {
        setErrorMsg("Submission failed. Please try again.");
        setSubmitting(false);
      }
    },
    [answers, questions, user, getTimeTaken, saveResult, navigate],
  );

  // ── Loading / error states ──
  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading questions...</p>
      </div>
    );
  }
  if (pageState === "error") {
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
  }
  if (questions.length === 0) return null;

  const question = questions[currentIndex];
  const selected = answers[question._id] as OptionKey | undefined;
  const answered = Object.keys(answers).length;
  const progressPct = ((currentIndex + 1) / questions.length) * 100;
  const timerPct = timeLeft / TOTAL_SECONDS;
  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, "0");
  const isLastQ = currentIndex === questions.length - 1;

  const timerColor =
    timerPct > 0.5
      ? "text-brand-500"
      : timerPct > 0.2
        ? "text-yellow-400"
        : "text-red-400";
  const timerBarColor =
    timerPct > 0.5
      ? "bg-brand-500"
      : timerPct > 0.2
        ? "bg-yellow-400"
        : "bg-red-400";

  const difficultyClass =
    question.difficulty === "easy"
      ? "tag-green"
      : question.difficulty === "hard"
        ? "tag-red"
        : "tag-yellow";

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* ── Top bar ── */}
      <header className="border-b border-gray-800 px-4 sm:px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="btn-ghost text-sm flex-shrink-0"
        >
          ← Exit
        </button>
        {/* Progress bar */}
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-sm text-gray-400 flex-shrink-0">
          {currentIndex + 1} / {questions.length}
        </span>
        {/* Timer */}
        <span
          className={`font-mono font-bold text-lg flex-shrink-0 tabular-nums ${timerColor}`}
        >
          {mins}:{secs}
        </span>
      </header>

      {/* Timer drain bar */}
      <div className="h-0.5 bg-gray-900">
        <div
          className={`h-full ${timerBarColor} transition-all duration-1000`}
          style={{ width: `${timerPct * 100}%` }}
        />
      </div>

      {/* ── Body ── */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 animate-fade-in">
        {/* Question card */}
        <div className="card p-6 sm:p-8 mb-6">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`tag ${difficultyClass}`}>
              {question.difficulty}
            </span>
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

        {/* Options */}
        <div className="space-y-3 mb-8">
          {OPTION_KEYS.map((key) => {
            const isSelected = selected === key;
            return (
              <button
                key={key}
                onClick={() => answerQuestion(question._id, key)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border
                  text-left transition-all duration-150 font-medium
                  ${
                    isSelected
                      ? "bg-brand-500/20 border-brand-500 text-white"
                      : "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                  }`}
              >
                <span
                  className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center
                    justify-center text-sm font-bold border transition-all
                    ${
                      isSelected
                        ? "bg-brand-500 border-brand-500 text-white"
                        : "border-gray-600 text-gray-500"
                    }`}
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

        {/* Navigation */}
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

        {/* Question dot navigator */}
        <div className="flex flex-wrap gap-2 justify-center">
          {questions.map((q, i) => {
            const isActive = i === currentIndex;
            const isAnswered = q._id in answers;
            return (
              <button
                key={q._id}
                onClick={() => goToQuestion(i)}
                title={`Question ${i + 1}${isAnswered ? " — answered" : ""}`}
                className={`w-8 h-8 rounded-md text-xs font-bold transition-all duration-150
                  ${
                    isActive
                      ? "bg-brand-500 text-white scale-110 shadow-lg shadow-brand-500/30"
                      : isAnswered
                        ? "bg-brand-500/25 text-brand-400 hover:bg-brand-500/40"
                        : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                  }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </main>

      {/* ── Unanswered confirm modal ── */}
      {showConfirm && (
        <ConfirmModal
          unanswered={questions.length - answered}
          onConfirm={() => {
            setShowConfirm(false);
            doSubmit(true);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* ── Error toast ── */}
      {errorMsg && pageState === "ready" && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white
                        px-6 py-3 rounded-xl shadow-2xl text-sm font-medium z-50"
        >
          {errorMsg}
        </div>
      )}
    </div>
  );
}

function ConfirmModal({
  unanswered,
  onConfirm,
  onCancel,
}: {
  unanswered: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="card p-6 max-w-sm w-full animate-slide-up">
        <div className="text-2xl mb-3">⚠️</div>
        <h3 className="text-lg font-bold text-white mb-2">Submit Test?</h3>
        <p className="text-gray-400 text-sm mb-6">
          You have{" "}
          <strong className="text-yellow-400">
            {unanswered} unanswered question{unanswered !== 1 ? "s" : ""}
          </strong>
          . They will be marked incorrect.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Go Back
          </button>
          <button onClick={onConfirm} className="btn-primary flex-1">
            Submit Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
