'use client';

import { useMemo } from 'react';
import { useStores } from '../stores';
import { CareTeam } from '../types/care-teams';
import { EmployeeRole } from '../types/employees';

export function useCareTeams(): CareTeam[] {
  const {
    careTeamsStore: { careTeamMap, query, roleFilter, selectedDays, selectedDepartments },
  } = useStores();

  return useMemo(() => {
    const careTeams = Array.from(careTeamMap.values());
    const formattedQuery = query.trim().toLowerCase();

    return careTeams.filter((d) => {
      if (roleFilter === EmployeeRole.Nurse && d.role !== EmployeeRole.Nurse) return false;
      if (roleFilter === EmployeeRole.Doctor && d.role !== EmployeeRole.Doctor) return false;

      if (formattedQuery && !d.fullName.toLowerCase().includes(formattedQuery)) {
        return false;
      }

      if (selectedDepartments.length > 0) {
        const code = d.departmentTypeCode;
        if (!code || !selectedDepartments.includes(code)) return false;
      }

      if (selectedDays.length > 0) {
        const hasAnyDay = d.scheduleDays?.some((day) => selectedDays.includes(day)) ?? false;
        if (!hasAnyDay) return false;
      }

      return true;
    });
  }, [careTeamMap, query, roleFilter, selectedDays, selectedDepartments]);
}
