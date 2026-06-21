"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/src/utils/api";
import useAuthStore from "@/src/store/auth.store";
import type { User } from "@/src/store/auth.store";
import type { LoginFormData } from "@/src/utils/auth.schema";
import type { AxiosError } from "axios";

// ── Types ─────────────────────────────────────────────────────────────

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface GoogleLoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
}

interface ApiError {
  message: string;
  statusCode: number;
}

// ── useLogin ──────────────────────────────────────────────────────────

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation<LoginResponse, AxiosError<ApiError>, LoginFormData>({
    mutationFn: async (data) => {
      const response = await api.post<LoginResponse>("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push("/");
    },
  });
}

// ── useRegister ───────────────────────────────────────────────────────

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export function useRegister() {
  const router = useRouter();

  return useMutation<RegisterResponse, AxiosError<ApiError>, RegisterPayload>({
    mutationFn: async (data) => {
      const response = await api.post<RegisterResponse>("/auth/register", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/login?registered=true");
    },
  });
}

// ── useGoogleLogin ───────────────────────────────────────────────────

export function useGoogleAuth() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation<
    GoogleLoginResponse,
    AxiosError<ApiError>,
    { idToken: string }
  >({
    mutationFn: async ({ idToken }) => {
      const response = await api.post<GoogleLoginResponse>("/auth/google", {
        idToken,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Normalize snake_case keys from Google login endpoint
      setAuth(data.user, data.access_token, data.refresh_token);
      router.push("/");
    },
  });
}

// ── useMe ─────────────────────────────────────────────────────────────

export function useMe() {
  const { accessToken, setUser, logout } = useAuthStore();

  return useQuery<User, AxiosError<ApiError>>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await api.get<User>("/auth/me");
      return response.data;
    },
    enabled: !!accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ── useLogout ─────────────────────────────────────────────────────────

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, AxiosError<ApiError>>({
    mutationFn: async () => {
      const response = await api.get<{ message: string }>("/auth/logout");
      return response.data;
    },
    onSettled: () => {
      // Always clear state, even if the API call fails
      logout();
      queryClient.clear();
      router.push("/login");
    },
  });
}
