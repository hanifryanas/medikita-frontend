'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthResponse } from '@/lib/types/auth';

type CurrentLoginUser = AuthResponse['user'];

interface AuthState {
  currentLoginUser: CurrentLoginUser | null;
  token: string | null;
}

interface AuthAction {
  login: (auth: AuthResponse) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthAction;

const initialAuthState: AuthState = {
  currentLoginUser: null,
  token: null,
};

const createAuthActions = (
  set: (partial: Partial<AuthState>) => void
): AuthAction => ({
  login: (auth) =>
    set({
      currentLoginUser: auth.user,
      token: auth.token,
    }),
  logout: () => set(initialAuthState),
});

const createAuthStore = (
  set: (partial: Partial<AuthState>) => void
): AuthStore => ({
  ...initialAuthState,
  ...createAuthActions(set),
});

export const authSelector = {
  isAuthenticated: (state: AuthStore) => Boolean(state.token),
};

export const useAuthStore = create<AuthStore>()(
  persist((set) => createAuthStore(set), {
    name: 'medikita-auth',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      currentLoginUser: state.currentLoginUser,
      token: state.token,
    }),
  })
);
