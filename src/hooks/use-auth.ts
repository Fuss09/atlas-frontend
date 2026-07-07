"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { clearStoredTokens, getStoredTokens, setStoredTokens } from "@/lib/auth-storage";
import type { LoginRequest } from "@/types";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
    retry: false,
    enabled: typeof window !== "undefined" && !!getStoredTokens(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (tokens) => {
      setStoredTokens(tokens);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      router.push("/dashboard");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    clearStoredTokens();
    queryClient.clear();
    router.push("/login");
  };
}
