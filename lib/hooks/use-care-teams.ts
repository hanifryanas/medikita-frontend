'use client';

import { useMemo } from 'react';
import { useStores } from '../stores';
import { CareTeam } from '../types/care-teams';
import { EmployeeRole } from '../types/employees';
import { sanitizeDoctorToCareTeam } from '../utils/sanitizers';

export function useCareTeams(): CareTeam[] {
  const {
    doctorStore: { doctors },
    careTeamsStore: { query, roleFilter, searchMode, selectedDays, selectedDepartments },
  } = useStores();

  return useMemo(() => {
    const doctorCareTeam = doctors.map(sanitizeDoctorToCareTeam);
    const formattedQuery = query.trim().toLowerCase();
    return doctorCareTeam.filter((d) => {
      if (roleFilter === EmployeeRole.Nurse) return false;

      if (searchMode === 'name' && formattedQuery) {
        if (!d.fullName.toLowerCase().includes(formattedQuery)) return false;
      }
      if (searchMode === 'days' && selectedDays.length > 0) {
        const days = d.schedules?.map((s) => s.day) ?? [];
        if (!selectedDays.every((day) => days.includes(day))) return false;
      }
      if (searchMode === 'department' && selectedDepartments.length > 0) {
        const code = d.departmentTypeCode;
        if (!code || !selectedDepartments.includes(code)) return false;
      }
      return true;
    });
  }, [doctors, query, roleFilter, searchMode, selectedDays, selectedDepartments]);
}
