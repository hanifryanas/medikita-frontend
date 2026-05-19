'use client';

import { CareTeamCard } from '@/app/components/care-teams';
import { ChipPicker } from '@/app/components/common';
import { PublicNav } from '@/app/components/navigation';
import { SearchIcon } from '@/app/icons';
import { useCareTeams } from '@/lib/hooks';
import { useStores } from '@/lib/stores';
import { CareTeamsRoleFilter } from '@/lib/stores/care-teams-store';
import { Day } from '@/lib/types/common';
import { EmployeeRole } from '@/lib/types/employees';
import { useMemo } from 'react';
import styles from './page.module.scss';

const FILTERS: { label: string; value: CareTeamsRoleFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Doctors', value: EmployeeRole.Doctor },
  { label: 'Nurses', value: EmployeeRole.Nurse },
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

export default function CareTeamsPage() {
  const {
    careTeamsStore: {
      query,
      roleFilter: filter,
      searchMode,
      selectedDays,
      selectedDepartments,
      setQuery,
      setRoleFilter: setFilter,
      setSearchMode,
      toggleDay,
      toggleDepartment,
      clearDays,
      clearDepartments,
    },
    departmentStore: { getDepartmentsByFlag },
  } = useStores();

  const departments = getDepartmentsByFlag({ isClinical: true });
  const departmentCodes = useMemo(() => departments.map((d) => d.typeCode), [departments]);

  const filtered = useCareTeams();

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
                selected={selectedDepartments}
                onToggle={toggleDepartment}
                onClear={clearDepartments}
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
            {filtered.map((c) => (
              <CareTeamCard key={c.careTeamId} careTeam={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
