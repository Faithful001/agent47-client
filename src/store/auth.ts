import { create } from "zustand";
import { api } from "../lib/api";
import type { BaseResponse } from "../types";

export interface User {
  user_id: string;
  username: string;
  avatar_url?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: () => boolean;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: true,

  isAuthenticated: () => get().user !== null,

  checkSession: async () => {
    try {
      const { data } = await api.get<BaseResponse<User>>("/auth/me");
      set({ user: data.data, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post<BaseResponse<any>>("/auth/logout");
    } catch {
      // Even if the API call fails, clear local state
    }
    set({ user: null });
    window.location.href = "/";
  },
}));
