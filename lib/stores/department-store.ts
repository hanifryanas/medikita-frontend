'use client';

import { create } from 'zustand';
import type { Department } from '../types/departments';

export interface DepartmentStore {
  departments: Department[];
  featuredDepartments: Department[];
  isLoaded: boolean;
  isLoading: boolean;
  setDepartments: (departments: Department[]) => void;
  setFeaturedDepartments: (featuredDepartments: Department[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  departments: [] as Department[],
  featuredDepartments: [] as Department[],
  isLoaded: false,
  isLoading: false,
};

export const useDepartmentStore = create<DepartmentStore>()((set) => ({
  ...initialState,

  setDepartments: (departments) =>
    set({ departments, isLoaded: true, isLoading: false }),

  setFeaturedDepartments: (featuredDepartments) =>
    set({ featuredDepartments, isLoaded: true, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () => set(initialState),
}));
