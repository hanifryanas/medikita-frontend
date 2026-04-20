'use client';

import { create } from 'zustand';
import { User } from '../types/users';
import { FormValidationResult } from '../types/validations';
import { SigninPayload, SignupPayload } from '../types/auth';
import { validateSignin, validateSignup } from '../validations';

export enum AuthStatus {
  Idle = 'idle',
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
}

export interface AuthStore {
  accessToken?: string;
  setAccessToken: (accessToken?: string) => void;
  signinPayload: Partial<SigninPayload>;
  signinValidationResult: FormValidationResult<Partial<SigninPayload>>;
  setSigninPayload: (payload: Partial<SigninPayload>) => void;
  validateSigninPayload: (
    payload?: Partial<SigninPayload>
  ) => FormValidationResult<Partial<SigninPayload>>;
  signin: (user: User, accessToken: string) => void;
  signout: () => void;
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
  signinPayload: {} as Partial<SigninPayload>,
  signUpPayload: {} as Partial<SignupPayload>,
  signinValidationResult: { errors: {} } as FormValidationResult<Partial<SigninPayload>>,
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

  setSigninPayload: (payload) => {
    set((state) => ({ signinPayload: { ...state.signinPayload, ...payload } }));
  },

  setSignUpPayload: (payload) => {
    set((state) => ({ signUpPayload: { ...state.signUpPayload, ...payload } }));
  },

  validateSigninPayload: (payload) => {
    const result = validateSignin(payload ?? get().signinPayload);
    set({ signinValidationResult: result });
    return result;
  },

  validateSignUpPayload: (payload) => {
    const result = validateSignup(payload ?? get().signUpPayload);
    set({ signUpValidationResult: result });
    return result;
  },

  signin: (user, accessToken) => {
    set({ currentUser: user, accessToken, status: AuthStatus.Authenticated });
  },

  signout: () => {
    set({ currentUser: undefined, accessToken: undefined, status: AuthStatus.Unauthenticated });
  },

  reset: () => {
    set({ ...initialState, status: AuthStatus.Unauthenticated });
  },
}));
