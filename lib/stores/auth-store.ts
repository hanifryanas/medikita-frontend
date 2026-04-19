'use client';

import { create } from 'zustand';
import { User } from '../types/users';
import { FormValidationResult } from '../types/validations';
import { LoginPayload, SignupPayload } from '../types/auth';
import { validateLogin, validateSignup } from '../validations';

export enum AuthStatus {
  Idle = 'idle',
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
}

export interface AuthStore {
  accessToken?: string;
  setAccessToken: (accessToken?: string) => void;
  loginPayload: Partial<LoginPayload>;
  loginValidationResult: FormValidationResult<Partial<LoginPayload>>;
  setLoginPayload: (payload: Partial<LoginPayload>) => void;
  validateLoginPayload: (
    payload?: Partial<LoginPayload>
  ) => FormValidationResult<Partial<LoginPayload>>;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setSignUpPayload: (payload: Partial<SignupPayload>) => void;
  signUpPayload: Partial<SignupPayload>;
  signUpValidationResult: FormValidationResult<Partial<SignupPayload>>;
  validateSignUpPayload: (
    payload?: Partial<SignupPayload>
  ) => FormValidationResult<Partial<SignupPayload>>;
  reset: () => void;
  status: AuthStatus;
  currentUser?: User;
  setUser: (user?: User) => void;
}

const resolveStatus = (user?: User, accessToken?: string): AuthStatus => {
  if (user || accessToken) return AuthStatus.Authenticated;
  return AuthStatus.Unauthenticated;
};

const initialState = {
  accessToken: undefined,
  currentUser: undefined,
  status: AuthStatus.Idle,
  loginPayload: {} as Partial<LoginPayload>,
  signUpPayload: {} as Partial<SignupPayload>,
  loginValidationResult: { errors: {} } as FormValidationResult<Partial<LoginPayload>>,
  signUpValidationResult: { errors: {} } as FormValidationResult<Partial<SignupPayload>>,
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  ...initialState,

  setAccessToken: (accessToken) => {
    set({ accessToken, status: resolveStatus(get().currentUser, accessToken) });
  },

  setUser: (user) => {
    set({ currentUser: user, status: resolveStatus(user, get().accessToken) });
  },

  setLoginPayload: (payload) => {
    set((state) => ({ loginPayload: { ...state.loginPayload, ...payload } }));
  },

  setSignUpPayload: (payload) => {
    set((state) => ({ signUpPayload: { ...state.signUpPayload, ...payload } }));
  },

  validateLoginPayload: (payload) => {
    const result = validateLogin(payload ?? get().loginPayload);
    set({ loginValidationResult: result });
    return result;
  },

  validateSignUpPayload: (payload) => {
    const result = validateSignup(payload ?? get().signUpPayload);
    set({ signUpValidationResult: result });
    return result;
  },

  login: (user, accessToken) => {
    set({ currentUser: user, accessToken, status: AuthStatus.Authenticated });
  },

  logout: () => {
    set({ currentUser: undefined, accessToken: undefined, status: AuthStatus.Unauthenticated });
  },

  reset: () => {
    set({ ...initialState, status: AuthStatus.Unauthenticated });
  },
}));
