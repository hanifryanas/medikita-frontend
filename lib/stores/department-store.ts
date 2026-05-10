'use client';

import { create } from 'zustand';
import type { Department } from '../types/departments';
import type { Employee } from '../types/employees';

export interface DepartmentStore {
  departments: Department[];
  featuredDepartments: Department[];
  departmentDoctorEmployeeMap: Map<string, Employee[]>;
  departmentNurseEmployeeMap: Map<string, Employee[]>;
  departmentStaffEmployeeMap: Map<string, Employee[]>;
  isLoaded: boolean;
  isLoading: boolean;
  reset: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setDepartments: (departments: Department[]) => void;
  setFeaturedDepartments: (featuredDepartments: Department[]) => void;
  getDepartmentByTypeCode: (typeCode: string) => Department | undefined;
  getDepartmentsByFlag: (flags: {
    isClinical?: boolean;
    isClinic?: boolean;
    isFeatured?: boolean;
  }) => Department[];
  getFeaturedEmployees: (typeCode: string, limit?: number) => Employee[];
}

const initialState = {
  departments: [] as Department[],
  featuredDepartments: [] as Department[],
  isLoaded: false,
  isLoading: false,
  departmentDoctorEmployeeMap: new Map<string, Employee[]>(),
  departmentNurseEmployeeMap: new Map<string, Employee[]>(),
  departmentStaffEmployeeMap: new Map<string, Employee[]>(),
};

export const useDepartmentStore = create<DepartmentStore>()((set, get) => ({
  ...initialState,

  reset: () => set(initialState),

  setIsLoading: (isLoading) => set({ isLoading }),

  setDepartments: (departments) => {
    const departmentDoctorEmployeeMap = new Map<string, Employee[]>();
    const departmentNurseEmployeeMap = new Map<string, Employee[]>();
    const departmentStaffEmployeeMap = new Map<string, Employee[]>();

    departments.forEach((department) => {
      const doctors: Employee[] = [];
      const nurses: Employee[] = [];
      const staff: Employee[] = [];

      (department.employees ?? []).forEach((employee) => {
        if (employee.doctor) doctors.push(employee);
        else if (employee.nurse) nurses.push(employee);
        else staff.push(employee);
      });

      departmentDoctorEmployeeMap.set(department.typeCode, doctors);
      departmentNurseEmployeeMap.set(department.typeCode, nurses);
      departmentStaffEmployeeMap.set(department.typeCode, staff);
    });

    set({
      departments,
      departmentDoctorEmployeeMap,
      departmentNurseEmployeeMap,
      departmentStaffEmployeeMap,
      isLoaded: true,
      isLoading: false,
    });
  },

  setFeaturedDepartments: (featuredDepartments) =>
    set({ featuredDepartments, isLoaded: true, isLoading: false }),

  getDepartmentByTypeCode: (typeCode) => get().departments.find((d) => d.typeCode === typeCode),

  getDepartmentsByFlag: (flags) =>
    get().departments.filter((dept) => {
      if (flags.isClinical !== undefined && dept.isClinical !== flags.isClinical) return false;
      if (flags.isClinic !== undefined && dept.isClinic !== flags.isClinic) return false;
      if (flags.isFeatured !== undefined && dept.featuredOrdinal === undefined) return false;
      return true;
    }),

  getFeaturedEmployees: (typeCode, limit = 3) => {
    const { departmentDoctorEmployeeMap, departmentNurseEmployeeMap, departmentStaffEmployeeMap } =
      get();

    const doctors = departmentDoctorEmployeeMap.get(typeCode) ?? [];
    const nurses = departmentNurseEmployeeMap.get(typeCode) ?? [];
    const staff = departmentStaffEmployeeMap.get(typeCode) ?? [];

    const bySeniority = (a: Employee, b: Employee) => {
      const aStart = a.startDate ? new Date(a.startDate).getTime() : Infinity;
      const bStart = b.startDate ? new Date(b.startDate).getTime() : Infinity;
      return aStart - bStart;
    };

    return [
      ...[...doctors].sort(bySeniority),
      ...[...nurses].sort(bySeniority),
      ...[...staff].sort(bySeniority),
    ].slice(0, limit);
  },
}));
