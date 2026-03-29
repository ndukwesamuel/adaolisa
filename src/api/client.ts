import axios from 'axios';
import type {
  LoginResponse,
  UsersResponse,
  QuestionsResponse,
  SubmitTestResponse,
  HistoryResponse,
  AnswerInput,
} from '@/types';

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth ──────────────────────────────────────────────
export const loginUser = (email: string, name?: string): Promise<LoginResponse> =>
  api.post<LoginResponse>('/auth/login', { email, name }).then((r) => r.data);

export const listUsers = (): Promise<UsersResponse> =>
  api.get<UsersResponse>('/auth/users').then((r) => r.data);

// ── Questions ─────────────────────────────────────────
export const fetchQuestions = (limit = 10): Promise<QuestionsResponse> =>
  api
    .get<QuestionsResponse>('/questions', { params: { type: 'numerical', limit } })
    .then((r) => r.data);

// ── Submit test ───────────────────────────────────────
export const submitTest = (
  userId: string,
  answers: AnswerInput[],
  timeTaken: number
): Promise<SubmitTestResponse> =>
  api
    .post<SubmitTestResponse>('/submit-test', { userId, answers, timeTaken })
    .then((r) => r.data);

// ── History ───────────────────────────────────────────
export const fetchHistory = (userId: string): Promise<HistoryResponse> =>
  api.get<HistoryResponse>(`/history/${userId}`).then((r) => r.data);

export default api;
