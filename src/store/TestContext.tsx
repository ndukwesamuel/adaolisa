import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type {
  Question,
  AnswerMap,
  TestResultSummary,
  WrongAnswerDetail,
  OptionKey,
} from "@/types";

interface TestState {
  questions: Question[];
  answers: AnswerMap;
  currentIndex: number;
  result: TestResultSummary | null;
  wrongAnswerDetails: WrongAnswerDetail[];
}

interface TestContextValue extends TestState {
  startTest: (questions: Question[]) => void;
  answerQuestion: (questionId: string, option: OptionKey) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  saveResult: (result: TestResultSummary, wrong: WrongAnswerDetail[]) => void;
  resetTest: () => void;
  getTimeTaken: () => number;
}

const TestContext = createContext<TestContextValue | null>(null);

const INITIAL_STATE: TestState = {
  questions: [],
  answers: {},
  currentIndex: 0,
  result: null,
  wrongAnswerDetails: [],
};

export function TestProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TestState>(INITIAL_STATE);
  const startTimeRef = useRef<number | null>(null);

  const startTest = useCallback((questions: Question[]) => {
    setState({ ...INITIAL_STATE, questions });
    startTimeRef.current = Date.now();
  }, []);

  const answerQuestion = useCallback(
    (questionId: string, option: OptionKey) => {
      setState((prev) => ({
        ...prev,
        answers: { ...prev.answers, [questionId]: option },
      }));
    },
    [],
  );

  const goToQuestion = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, Math.min(index, prev.questions.length - 1)),
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, prev.questions.length - 1),
    }));
  }, []);

  const prevQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0),
    }));
  }, []);

  const saveResult = useCallback(
    (result: TestResultSummary, wrongAnswerDetails: WrongAnswerDetail[]) => {
      setState((prev) => ({ ...prev, result, wrongAnswerDetails }));
    },
    [],
  );

  const resetTest = useCallback(() => {
    setState(INITIAL_STATE);
    startTimeRef.current = null;
  }, []);

  const getTimeTaken = useCallback((): number => {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  return (
    <TestContext.Provider
      value={{
        ...state,
        startTest,
        answerQuestion,
        goToQuestion,
        nextQuestion,
        prevQuestion,
        saveResult,
        resetTest,
        getTimeTaken,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest(): TestContextValue {
  const ctx = useContext(TestContext);
  if (!ctx) throw new Error("useTest must be used inside <TestProvider>");
  return ctx;
}
