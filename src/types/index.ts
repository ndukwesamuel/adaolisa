// ── Primitives ─────────────────────────────────────
export type OptionKey = 'A' | 'B' | 'C' | 'D';
export type Difficulty = 'easy' | 'medium' | 'hard';

// ── Auth ────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface SeededUser {
  _id: string;
  name: string;
  email: string;
}

// ── Question ────────────────────────────────────────
export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface Question {
  _id: string;
  questionText: string;
  options: QuestionOptions;
  category: string;
  tags: string[];
  difficulty: Difficulty;
  // correctAnswer & explanation are NOT returned by GET /questions
}

// ── Answers ─────────────────────────────────────────
export interface AnswerInput {
  questionId: string;
  selectedOption: OptionKey;
}

export type AnswerMap = Record<string, OptionKey>; // questionId → selectedOption

// ── Test result ─────────────────────────────────────
export interface TestResultSummary {
  _id: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
  weakAreas: string[];
  createdAt: string;
}

export interface WrongAnswerDetail {
  questionId: string;
  questionText: string;
  yourAnswer: OptionKey;
  correctAnswer: OptionKey;
  explanation: string;
  tags: string[];
}

export interface SubmitTestResponse {
  message: string;
  result: TestResultSummary;
  wrongAnswerDetails: WrongAnswerDetail[];
}

// ── History ─────────────────────────────────────────
export interface HistoryAttempt {
  attemptNumber: number;
  _id: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
  weakAreas: string[];
  createdAt: string;
}

export interface Trend {
  firstAttemptAccuracy: number;
  latestAttemptAccuracy: number;
  change: number;
  improving: boolean;
}

export interface HistoryResponse {
  userId: string;
  totalAttempts: number;
  trend: Trend | null;
  history: HistoryAttempt[];
}

// ── API response wrappers ────────────────────────────
export interface QuestionsResponse {
  questions: Question[];
  total: number;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface UsersResponse {
  users: SeededUser[];
}
