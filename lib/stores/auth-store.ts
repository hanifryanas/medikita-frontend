'use client';

import { create } from 'zustand';
import { User } from '../types/users';

export enum AuthStatus {
  Idle = 'idle',
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
}

export interface AuthStore {
  accessToken?: string;
  currentUser?: User;
  status: AuthStatus;
  signin: (user: User, accessToken: string) => void;
  signout: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  accessToken: undefined,
  currentUser: undefined,
  status: AuthStatus.Idle,

  signin: (user, accessToken) => {
    set({ currentUser: user, accessToken, status: AuthStatus.Authenticated });
  },

  signout: () => {
    set({ currentUser: undefined, accessToken: undefined, status: AuthStatus.Unauthenticated });
  },

  reset: () => {
    set({ currentUser: undefined, accessToken: undefined, status: AuthStatus.Unauthenticated });
  },
}));
