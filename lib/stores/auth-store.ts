'use client';

import { create } from 'zustand';
import { User } from '../types/users';
import { AuthStatus } from './auth-status.enum';

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
