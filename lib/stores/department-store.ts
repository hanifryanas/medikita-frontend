'use client';

import { create } from 'zustand';
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
  reset: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setDepartments: (departments: Department[]) => void;
  setFeaturedDepartments: (featuredDepartments: FeaturedDepartment[]) => void;
  getDepartmentByTypeCode: (typeCode: string) => Department | undefined;
  getDepartmentsByFlag: (flags: {
    isClinical?: boolean;
    isClinic?: boolean;
    isFeatured?: boolean;
  }) => Department[];
}

const initialState = {
  departmentMap: new Map<string, Department>(),
  featuredDepartmentMap: new Map<string, FeaturedDepartment>(),
  departmentDoctorEmployeeMap: new Map<string, DepartmentEmployee[]>(),
  departmentNurseEmployeeMap: new Map<string, DepartmentEmployee[]>(),
  departmentStaffEmployeeMap: new Map<string, DepartmentEmployee[]>(),
  isLoaded: false,
  isLoading: false,
};

export const useDepartmentStore = create<DepartmentStore>()((set, get) => ({
  ...initialState,

  reset: () => set(initialState),

  setIsLoading: (isLoading) => set({ isLoading }),

  setDepartments: (departments) => {
    const departmentDoctorEmployeeMap = new Map<string, DepartmentEmployee[]>();
    const departmentNurseEmployeeMap = new Map<string, DepartmentEmployee[]>();
    const departmentStaffEmployeeMap = new Map<string, DepartmentEmployee[]>();

    departments.forEach((department) => {
      const doctors: DepartmentEmployee[] = [];
      const nurses: DepartmentEmployee[] = [];
      const staff: DepartmentEmployee[] = [];

      (department.employees ?? []).forEach((employee) => {
        if (employee.role === EmployeeRole.Doctor) {
          doctors.push(employee);
        } else if (employee.role === EmployeeRole.Nurse) {
          nurses.push(employee);
        } else {
          staff.push(employee);
        }
      });

      departmentDoctorEmployeeMap.set(department.typeCode, doctors);
      departmentNurseEmployeeMap.set(department.typeCode, nurses);
      departmentStaffEmployeeMap.set(department.typeCode, staff);
    });

    set({
      departmentMap: new Map(departments.map((department) => [department.typeCode, department])),
      departmentDoctorEmployeeMap,
      departmentNurseEmployeeMap,
      departmentStaffEmployeeMap,
      isLoaded: true,
      isLoading: false,
    });
  },

  setFeaturedDepartments: (featuredDepartments) =>
    set({
      featuredDepartmentMap: new Map(
        featuredDepartments.map((department) => [department.typeCode, department])
      ),
      isLoaded: true,
      isLoading: false,
    }),

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
}));
