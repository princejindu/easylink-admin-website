import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Admin } from "@/types/auth.types";

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrated: boolean;
}

interface AuthActions {
  setAuth: (admin: Admin, token: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
}

const initialState: AuthState = {
  admin: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  hydrated: false,
};

const STORAGE_VERSION = 1;

function isValidAdmin(admin: unknown): admin is Admin {
  if (!admin || typeof admin !== "object") return false;
  const a = admin as Record<string, unknown>;
  return (
    typeof a.id === "string" &&
    typeof a.email === "string" &&
    typeof a.fullName === "string" &&
    typeof a.status === "string" &&
    ["active", "inactive", "suspended"].includes(
      (a.status as string).toLowerCase()
    )
  );
}

const validatedStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(name);
      if (!item) return null;
      const parsed = JSON.parse(item);
      const state = parsed?.state;
      if (state?.admin && !isValidAdmin(state.admin)) {
        localStorage.removeItem(name);
        localStorage.removeItem("auth_token");
        return null;
      }
      return item;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, value);
    } catch {
      // storage write failed, skip silently
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch {
      // storage remove failed, skip silently
    }
  },
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (admin, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
        }
        set({ admin, token, isAuthenticated: true, isLoading: false });
      },
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      setLoading: (isLoading) => set({ isLoading }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "auth-storage",
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => validatedStorage),
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // hydration error, continue with clean state
        }
        if (state) {
          state.isLoading = false;
          state.hydrated = true;
        }
      },
    }
  )
);
