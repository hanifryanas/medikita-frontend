'use client';

import { CareTeamCard } from '@/app/components/care-teams';
import { ChipPicker } from '@/app/components/common';
import { PublicNav } from '@/app/components/navigation';
import { SearchIcon } from '@/app/icons';
import { useCareTeamsStore, useDepartmentStore, useDoctorStore } from '@/lib/stores';
import { Day } from '@/lib/types/common';
import type { Doctor } from '@/lib/types/doctors';
import { useMemo } from 'react';
import styles from './page.module.scss';

const FILTERS = [
  { label: 'All', value: 'all' as const },
  { label: 'Doctors', value: 'doctor' as const },
  { label: 'Nurses', value: 'nurse' as const },
];

const SEARCH_MODES = [
  { label: 'Name', value: 'name' as const },
  { label: 'Days', value: 'days' as const },
  { label: 'Department', value: 'department' as const },
];

const DAY_OPTIONS: { value: Day; label: string }[] = [
  { value: Day.Monday, label: 'Mon' },
  { value: Day.Tuesday, label: 'Tue' },
  { value: Day.Wednesday, label: 'Wed' },
  { value: Day.Thursday, label: 'Thu' },
  { value: Day.Friday, label: 'Fri' },
  { value: Day.Saturday, label: 'Sat' },
  { value: Day.Sunday, label: 'Sun' },
];

const getDoctorName = (d: Doctor) => {
  const employee = d.employee;
  const fullName =
    employee?.fullName ||
    [employee?.user?.firstName, employee?.user?.lastName].filter(Boolean).join(' ') ||
    'Unknown';
  return d.title ? `${d.title} ${fullName}` : fullName;
};

export default function CareTeamsPage() {
  const query = useCareTeamsStore((s) => s.query);
  const filter = useCareTeamsStore((s) => s.roleFilter);
  const searchMode = useCareTeamsStore((s) => s.searchMode);
  const selectedDays = useCareTeamsStore((s) => s.selectedDays);
  const selectedDepts = useCareTeamsStore((s) => s.selectedDepts);
  const setQuery = useCareTeamsStore((s) => s.setQuery);
  const setFilter = useCareTeamsStore((s) => s.setRoleFilter);
  const setSearchMode = useCareTeamsStore((s) => s.setSearchMode);
  const toggleDay = useCareTeamsStore((s) => s.toggleDay);
  const toggleDept = useCareTeamsStore((s) => s.toggleDept);
  const clearDays = useCareTeamsStore((s) => s.clearDays);
  const clearDepts = useCareTeamsStore((s) => s.clearDepts);

  const doctors = useDoctorStore((s) => s.doctors);

  const getDepartmentsByFlag = useDepartmentStore((s) => s.getDepartmentsByFlag);
  const departments = getDepartmentsByFlag({ isClinical: true });
  const departmentCodes = useMemo(() => departments.map((d) => d.typeCode), [departments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doctors.filter((d) => {
      if (filter === 'nurse') return false;

      if (searchMode === 'name' && q) {
        if (!getDoctorName(d).toLowerCase().includes(q)) return false;
      }
      if (searchMode === 'days' && selectedDays.length > 0) {
        const days = d.scheduleDays ?? [];
        if (!selectedDays.every((day) => days.includes(day))) return false;
      }
      if (searchMode === 'department' && selectedDepts.length > 0) {
        const code = d.employee?.department?.typeCode;
        if (!code || !selectedDepts.includes(code)) return false;
      }
      return true;
    });
  }, [doctors, query, filter, searchMode, selectedDays, selectedDepts]);

  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.content}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Care Teams</span>
          <h1 className={styles.heading}>Meet the people behind your care</h1>
          <p className={styles.subtitle}>
            Browse the full roster — by name, schedule, or department.
          </p>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.searchGroup}>
            {searchMode === 'name' ? (
              <div className={styles.search}>
                <span className={styles.searchIcon}>
                  <SearchIcon />
                </span>
                <input
                  type='search'
                  className={styles.searchInput}
                  placeholder='Search by name'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            ) : searchMode === 'days' ? (
              <ChipPicker
                options={DAY_OPTIONS}
                selected={selectedDays}
                onToggle={toggleDay}
                onClear={clearDays}
                ariaLabel='Filter by day'
              />
            ) : (
              <ChipPicker
                options={departmentCodes}
                selected={selectedDepts}
                onToggle={toggleDept}
                onClear={clearDepts}
                ariaLabel='Filter by department'
              />
            )}

            <div className={styles.searchModes} role='tablist' aria-label='Search by'>
              {SEARCH_MODES.map((m) => (
                <button
                  key={m.value}
                  type='button'
                  role='tab'
                  aria-selected={searchMode === m.value}
                  className={`${styles.modeBtn} ${
                    searchMode === m.value ? styles.modeBtnActive : ''
                  }`}
                  onClick={() => setSearchMode(m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filters} role='tablist' aria-label='Filter by role'>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type='button'
                role='tab'
                aria-selected={filter === f.value}
                className={`${styles.filterBtn} ${
                  filter === f.value ? styles.filterBtnActive : ''
                }`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>No team members match your search.</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((d) => (
              <CareTeamCard key={d.doctorId} doctor={d} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
