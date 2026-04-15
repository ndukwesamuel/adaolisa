// export type OptionKey      = 'A' | 'B' | 'C' | 'D';
// export type Difficulty     = 'easy' | 'medium' | 'hard';
// export type ModuleCategory = 'numerical' | 'verbal' | 'logical';

// export interface User       { _id: string; name: string; email: string; }
// export interface SeededUser { _id: string; name: string; email: string; }
// export interface QuestionOptions { A: string; B: string; C: string; D: string; }

// export interface Question {
//   _id: string; questionText: string; options: QuestionOptions;
//   category: ModuleCategory; tags: string[]; difficulty: Difficulty;
// }

// export interface AnswerInput { questionId: string; selectedOption: OptionKey; }
// export type AnswerMap = Record<string, OptionKey>;

// export interface TestResultSummary {
//   _id: string; module: ModuleCategory; score: number; totalQuestions: number;
//   accuracy: number; timeTaken: number; weakAreas: string[]; createdAt: string;
// }

// export interface WrongAnswerDetail {
//   questionId: string; questionText: string; yourAnswer: OptionKey;
//   correctAnswer: OptionKey; explanation: string; tags: string[];
// }

// export interface SubmitTestResponse {
//   message: string; result: TestResultSummary; wrongAnswerDetails: WrongAnswerDetail[];
// }

// export interface HistoryAttempt {
//   attemptNumber: number; _id: string; module: ModuleCategory; score: number;
//   totalQuestions: number; accuracy: number; timeTaken: number; weakAreas: string[]; createdAt: string;
// }

// export interface Trend {
//   firstAttemptAccuracy: number; latestAttemptAccuracy: number; change: number; improving: boolean;
// }

// export interface HistoryResponse {
//   userId: string; module: string; totalAttempts: number; trend: Trend | null; history: HistoryAttempt[];
// }

// export interface QuestionsResponse { questions: Question[]; total: number; }
// export interface LoginResponse     { message: string; user: User; }
// export interface UsersResponse     { users: SeededUser[]; }

export type OptionKey = "A" | "B" | "C" | "D";
export type Difficulty = "easy" | "medium" | "hard";
export type ModuleCategory = "numerical" | "verbal" | "logical" | "abstract";

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
  category: ModuleCategory;
  tags: string[];
  difficulty: Difficulty;
}

export interface AnswerInput {
  questionId: string;
  selectedOption: OptionKey;
}
export type AnswerMap = Record<string, OptionKey>;

export interface TestResultSummary {
  _id: string;
  module: ModuleCategory;
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

export interface HistoryAttempt {
  attemptNumber: number;
  _id: string;
  module: ModuleCategory;
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
  module: string;
  totalAttempts: number;
  trend: Trend | null;
  history: HistoryAttempt[];
}

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
