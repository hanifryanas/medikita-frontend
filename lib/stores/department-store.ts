'use client';

import { create } from 'zustand';
import { nextApi } from '../api/next';
import type { Department } from '../types/departments';
import { FeaturedDepartment } from '../types/departments/featured-department';
import { EmployeeRole } from '../types/employees';
import { DepartmentEmployee } from '../types/employees/department-employee';

export interface DepartmentStore {
  departmentMap: Map<string, Department>;
  featuredDepartmentMap: Map<string, FeaturedDepartment>;
  departmentDoctorEmployeeMap: Map<string, DepartmentEmployee[]>;
  departmentNurseEmployeeMap: Map<string, DepartmentEmployee[]>;
  departmentStaffEmployeeMap: Map<string, DepartmentEmployee[]>;
  isLoaded: boolean;
  isLoading: boolean;
  loadError: string | null;
  lastFetchedAt: number | null;

  fetchDepartments: () => Promise<void>;
  getDepartmentByTypeCode: (typeCode: string) => Department | undefined;
  getDepartmentsByFlag: (flags: {
    isClinical?: boolean;
    isClinic?: boolean;
    isFeatured?: boolean;
  }) => Department[];

  reset: () => void;
}

interface InternalState {
  _loadId: number;
}

const initialState = {
  departmentMap: new Map<string, Department>(),
  featuredDepartmentMap: new Map<string, FeaturedDepartment>(),
  departmentDoctorEmployeeMap: new Map<string, DepartmentEmployee[]>(),
  departmentNurseEmployeeMap: new Map<string, DepartmentEmployee[]>(),
  departmentStaffEmployeeMap: new Map<string, DepartmentEmployee[]>(),
  isLoaded: false,
  isLoading: false,
  loadError: null,
  lastFetchedAt: null,
  _loadId: 0,
};

/**
 * Group a department's employees into role-bucketed maps keyed by typeCode.
 * Done at ingest time so render paths don't re-filter on every read.
 */
const groupEmployeesByRole = (departments: Department[]) => {
  const doctors = new Map<string, DepartmentEmployee[]>();
  const nurses = new Map<string, DepartmentEmployee[]>();
  const staff = new Map<string, DepartmentEmployee[]>();

  departments.forEach((department) => {
    const doc: DepartmentEmployee[] = [];
    const nur: DepartmentEmployee[] = [];
    const stf: DepartmentEmployee[] = [];

    (department.employees ?? []).forEach((employee) => {
      if (employee.role === EmployeeRole.Doctor) doc.push(employee);
      else if (employee.role === EmployeeRole.Nurse) nur.push(employee);
      else stf.push(employee);
    });

    doctors.set(department.typeCode, doc);
    nurses.set(department.typeCode, nur);
    staff.set(department.typeCode, stf);
  });

  return { doctors, nurses, staff };
};

export const useDepartmentStore = create<DepartmentStore & InternalState>()((set, get) => ({
  ...initialState,

  fetchDepartments: async () => {
    const loadId = get()._loadId + 1;
    set({ _loadId: loadId, isLoading: true, loadError: null });
    try {
      const { departments, featuredDepartments } = await nextApi.departments.getDepartments();
      // Drop stale response: another fetch (or reset) started after this one.
      if (get()._loadId !== loadId) return;

      const { doctors, nurses, staff } = groupEmployeesByRole(departments);
      set({
        departmentMap: new Map(departments.map((d) => [d.typeCode, d])),
        featuredDepartmentMap: new Map(featuredDepartments.map((d) => [d.typeCode, d])),
        departmentDoctorEmployeeMap: doctors,
        departmentNurseEmployeeMap: nurses,
        departmentStaffEmployeeMap: staff,
        isLoaded: true,
        isLoading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (err) {
      if (get()._loadId !== loadId) return;
      set({
        isLoading: false,
        loadError: err instanceof Error ? err.message : 'Failed to load departments.',
      });
    }
  },

  getDepartmentByTypeCode: (typeCode) => get().departmentMap.get(typeCode),

  getDepartmentsByFlag: (flags) =>
    Array.from(get().departmentMap.values()).filter((dept) => {
      if (flags.isClinical !== undefined && dept.isClinical !== flags.isClinical) return false;
      if (flags.isClinic !== undefined && dept.isClinic !== flags.isClinic) return false;
      if (flags.isFeatured !== undefined) {
        const isFeatured = get().featuredDepartmentMap.has(dept.typeCode);
        if (isFeatured !== flags.isFeatured) return false;
      }
      return true;
    }),

  reset: () => set((s) => ({ ...initialState, _loadId: s._loadId + 1 })),
}));
