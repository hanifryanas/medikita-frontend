'use client';

import { ChipPicker, Tag } from '@/app/components/common';
import { PublicNav } from '@/app/components/navigation';
import { SearchIcon } from '@/app/icons';
import { useCareTeams } from '@/lib/hooks';
import { useStores } from '@/lib/stores';
import { CareTeamsRoleFilter } from '@/lib/stores/care-teams-store';
import { Day } from '@/lib/types/common';
import { EmployeeRole } from '@/lib/types/employees';
import { useMemo } from 'react';
import { CareTeamCard } from './_components';
import styles from './page.module.scss';

const FILTERS: { label: string; value: CareTeamsRoleFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Doctors', value: EmployeeRole.Doctor },
  { label: 'Nurses', value: EmployeeRole.Nurse },
];

const SEARCH_MODES = [
  { label: 'Name', value: 'name' as const },
  { label: 'Department', value: 'department' as const },
  { label: 'Days', value: 'days' as const },
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

const DAY_LABEL: Record<Day, string> = {
  [Day.Monday]: 'Mon',
  [Day.Tuesday]: 'Tue',
  [Day.Wednesday]: 'Wed',
  [Day.Thursday]: 'Thu',
  [Day.Friday]: 'Fri',
  [Day.Saturday]: 'Sat',
  [Day.Sunday]: 'Sun',
};

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
      clearFilters,
    },
    departmentStore: { getDepartmentsByFlag, getDepartmentByTypeCode },
  } = useStores();

  const departments = getDepartmentsByFlag({ isClinical: true });
  const departmentCodes = useMemo(() => departments.map((d) => d.typeCode), [departments]);

  const availableDayOptions = useMemo(
    () => DAY_OPTIONS.filter((d) => !selectedDays.includes(d.value)),
    [selectedDays]
  );
  const availableDepartmentCodes = useMemo(
    () => departmentCodes.filter((c) => !selectedDepartments.includes(c)),
    [departmentCodes, selectedDepartments]
  );

  const filtered = useCareTeams();

  const hasNameTag = query.trim().length > 0;
  const hasRoleTag = filter !== 'all';
  const roleTagLabel = FILTERS.find((f) => f.value === filter)?.label ?? '';
  const hasAnyFilter =
    hasNameTag || hasRoleTag || selectedDays.length > 0 || selectedDepartments.length > 0;

  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.content}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Care Teams</span>
          <h1 className={styles.heading}>Meet the people behind your care</h1>
          <p className={styles.subtitle}>
            Browse the full roster and get to know the dedicated professionals who support your
            health journey.
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
                options={availableDayOptions}
                selected={[]}
                onToggle={toggleDay}
                ariaLabel='Pick days'
              />
            ) : (
              <ChipPicker
                options={availableDepartmentCodes}
                selected={[]}
                onToggle={toggleDepartment}
                ariaLabel='Pick departments'
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

        {hasAnyFilter && (
          <div className={styles.activeFilters} aria-label='Active filters'>
            {hasNameTag && (
              <Tag label='Name:' onRemove={() => setQuery('')} removeAriaLabel='Clear name filter'>
                {query.trim()}
              </Tag>
            )}

            {hasRoleTag && (
              <Tag
                label='Role:'
                onRemove={() => setFilter('all')}
                removeAriaLabel='Clear role filter'
              >
                {roleTagLabel}
              </Tag>
            )}

            {selectedDepartments.map((code) => {
              const dept = getDepartmentByTypeCode(code);
              const name = dept?.displayName ?? code;
              return (
                <Tag
                  key={`dept-${code}`}
                  label='Dept:'
                  onRemove={() => toggleDepartment(code)}
                  removeAriaLabel={`Remove ${name} filter`}
                >
                  {name}
                </Tag>
              );
            })}

            {selectedDays.map((day) => (
              <Tag
                key={`day-${day}`}
                label='Day:'
                onRemove={() => toggleDay(day)}
                removeAriaLabel={`Remove ${DAY_LABEL[day]} filter`}
              >
                {DAY_LABEL[day]}
              </Tag>
            ))}

            <button type='button' className={styles.clearAllBtn} onClick={() => clearFilters()}>
              Clear all
            </button>
          </div>
        )}

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
