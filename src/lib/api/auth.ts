import { apiClient } from "./client";
import type { LoginRequest, RegisterRequest, TokenResponse, User } from "@/types";

export const authApi = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const res = await apiClient.post<TokenResponse>("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const res = await apiClient.post<User>("/auth/register", data);
    return res.data;
  },

  refresh: async (refresh_token: string): Promise<TokenResponse> => {
    const res = await apiClient.post<TokenResponse>("/auth/refresh", { refresh_token });
    return res.data;
  },

  me: async (): Promise<User> => {
    const res = await apiClient.get<User>("/auth/me");
    return res.data;
  },
};
