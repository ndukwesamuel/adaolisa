import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { Question, AnswerMap, TestResultSummary, WrongAnswerDetail, OptionKey, ModuleCategory } from '@/types';

interface TestState {
  module: ModuleCategory; questions: Question[]; answers: AnswerMap;
  currentIndex: number; result: TestResultSummary | null; wrongAnswerDetails: WrongAnswerDetail[];
}
interface TestContextValue extends TestState {
  startTest:      (questions: Question[], module: ModuleCategory) => void;
  answerQuestion: (questionId: string, option: OptionKey) => void;
  goToQuestion:   (index: number) => void;
  nextQuestion:   () => void;
  prevQuestion:   () => void;
  saveResult:     (result: TestResultSummary, wrong: WrongAnswerDetail[]) => void;
  resetTest:      (module?: ModuleCategory) => void;
  getTimeTaken:   () => number;
}

const TestContext = createContext<TestContextValue | null>(null);
const INIT: TestState = { module: 'numerical', questions: [], answers: {}, currentIndex: 0, result: null, wrongAnswerDetails: [] };

export function TestProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TestState>(INIT);
  const startRef = useRef<number | null>(null);

  const startTest = useCallback((questions: Question[], module: ModuleCategory) => {
    setState({ ...INIT, questions, module }); startRef.current = Date.now();
  }, []);
  const answerQuestion = useCallback((questionId: string, option: OptionKey) => {
    setState((p) => ({ ...p, answers: { ...p.answers, [questionId]: option } }));
  }, []);
  const goToQuestion = useCallback((index: number) => {
    setState((p) => ({ ...p, currentIndex: Math.max(0, Math.min(index, p.questions.length - 1)) }));
  }, []);
  const nextQuestion = useCallback(() => setState((p) => ({ ...p, currentIndex: Math.min(p.currentIndex + 1, p.questions.length - 1) })), []);
  const prevQuestion = useCallback(() => setState((p) => ({ ...p, currentIndex: Math.max(p.currentIndex - 1, 0) })), []);
  const saveResult = useCallback((result: TestResultSummary, wrongAnswerDetails: WrongAnswerDetail[]) => {
    setState((p) => ({ ...p, result, wrongAnswerDetails }));
  }, []);
  const resetTest = useCallback((module: ModuleCategory = 'numerical') => {
    setState({ ...INIT, module }); startRef.current = null;
  }, []);
  const getTimeTaken = useCallback((): number => {
    if (!startRef.current) return 0; return Math.floor((Date.now() - startRef.current) / 1000);
  }, []);

  return (
    <TestContext.Provider value={{ ...state, startTest, answerQuestion, goToQuestion, nextQuestion, prevQuestion, saveResult, resetTest, getTimeTaken }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTest(): TestContextValue {
  const ctx = useContext(TestContext);
  if (!ctx) throw new Error('useTest must be inside TestProvider');
  return ctx;
}
