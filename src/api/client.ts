import axios from "axios";
import type {
  LoginResponse,
  UsersResponse,
  QuestionsResponse,
  SubmitTestResponse,
  HistoryResponse,
  AnswerInput,
  ModuleCategory,
} from "@/types";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

export const loginUser = (
  email: string,
  name?: string,
): Promise<LoginResponse> =>
  api.post<LoginResponse>("/auth/login", { email, name }).then((r) => r.data);

export const listUsers = (): Promise<UsersResponse> =>
  api.get<UsersResponse>("/auth/users").then((r) => r.data);

export const fetchQuestions = (
  module: ModuleCategory = "numerical",
  limit = 10,
): Promise<QuestionsResponse> =>
  api
    .get<QuestionsResponse>("/questions", { params: { type: module, limit } })
    .then((r) => r.data);

export const submitTest = (
  userId: string,
  answers: AnswerInput[],
  timeTaken: number,
  module: ModuleCategory = "numerical",
): Promise<SubmitTestResponse> =>
  api
    .post<SubmitTestResponse>("/submit-test", {
      userId,
      answers,
      timeTaken,
      module,
    })
    .then((r) => r.data);

export const fetchHistory = (
  userId: string,
  module: ModuleCategory | null = null,
): Promise<HistoryResponse> =>
  api
    .get<HistoryResponse>(`/history/${userId}`, {
      params: module ? { module } : {},
    })
    .then((r) => r.data);

export default api;
