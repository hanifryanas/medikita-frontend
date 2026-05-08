'use client';

import { create } from 'zustand';
import { AuthStatus } from '../types/auth';
import { AccountUser } from '../types/users';

export interface AuthStore {
  accessToken?: string;
  currentUser?: AccountUser;
  status: AuthStatus;
  signin: (user: AccountUser, accessToken: string) => void;
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
