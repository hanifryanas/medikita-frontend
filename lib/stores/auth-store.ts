'use client';

import { create } from 'zustand';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  phoneNumber?: string;
}

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

export interface AuthStore {
  accessToken: string | null;
  user: AuthUser | null;
  userId: string | null;
  status: AuthStatus;
  login: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
  setAccessToken: (accessToken: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  reset: () => void;
  getAccessToken: () => Promise<string | null>;
}

const resolveStatus = (user: AuthUser | null, accessToken: string | null): AuthStatus => {
  if (user || accessToken) {
    return 'authenticated';
  }

  return 'unauthenticated';
};

const initialState = {
  accessToken: null,
  user: null,
  userId: null,
  status: 'idle' as AuthStatus,
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  ...initialState,

  login: (user, accessToken) => {
    set({
      user,
      userId: user.id,
      accessToken,
      status: 'authenticated',
    });
  },

  logout: () => {
    set({
      ...initialState,
      status: 'unauthenticated',
    });
  },

  setAccessToken: (accessToken) => {
    const user = get().user;

    set({
      accessToken,
      status: resolveStatus(user, accessToken),
    });
  },

  setUser: (user) => {
    const accessToken = get().accessToken;

    set({
      user,
      userId: user?.id ?? null,
      status: resolveStatus(user, accessToken),
    });
  },

  reset: () => {
    set({
      ...initialState,
      status: 'unauthenticated',
    });
  },

  getAccessToken: async () => {
    return get().accessToken;
  },
}));
