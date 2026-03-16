import { create } from "zustand";
import { api } from "../lib/api";

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
      const { data: user } = await api.get<User>("/auth/me");
      set({ user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if the API call fails, clear local state
    }
    set({ user: null });
    window.location.href = "/";
  },
}));
