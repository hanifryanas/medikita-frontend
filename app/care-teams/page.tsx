'use client';

import { ChipPicker } from '@/app/components/common';
import { PublicNav } from '@/app/components/navigation';
import { SearchIcon } from '@/app/icons';
import type { CareRole, DayShort } from '@/lib/stores';
import { useCareTeamsStore, useDepartmentStore } from '@/lib/stores';
import { getUserInitial } from '@/lib/utils/formatters';
import { useMemo } from 'react';
import styles from './page.module.scss';

interface CareMember {
  id: string;
  name: string;
  role: CareRole;
  specialization: string;
  department: string;
  scheduledDays: DayShort[];
}

const MEMBERS: CareMember[] = [
  {
    id: '1',
    name: 'Dr. Aulia Pramudita',
    role: 'doctor',
    specialization: 'Cardiology',
    department: 'Heart Center',
    scheduledDays: ['Mon', 'Wed', 'Fri'],
  },
  {
    id: '2',
    name: 'Dr. Rendra Wicaksana',
    role: 'doctor',
    specialization: 'Pediatrics',
    department: 'Children Care',
    scheduledDays: ['Tue', 'Thu', 'Sat'],
  },
  {
    id: '3',
    name: 'Dr. Maya Larasati',
    role: 'doctor',
    specialization: 'Dermatology',
    department: 'Skin & Aesthetics',
    scheduledDays: ['Mon', 'Tue', 'Thu'],
  },
  {
    id: '4',
    name: 'Siti Nurhaliza',
    role: 'nurse',
    specialization: 'Emergency Care',
    department: 'ER',
    scheduledDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  {
    id: '5',
    name: 'Bagus Setiawan',
    role: 'nurse',
    specialization: 'Pediatric Nursing',
    department: 'Children Care',
    scheduledDays: ['Wed', 'Thu', 'Fri', 'Sat'],
  },
  {
    id: '6',
    name: 'Dr. Hanif Ryan',
    role: 'doctor',
    specialization: 'Neurology',
    department: 'Neuroscience',
    scheduledDays: ['Mon', 'Wed', 'Fri'],
  },
  {
    id: '7',
    name: 'Indah Permata',
    role: 'nurse',
    specialization: 'Surgical Nursing',
    department: 'Operating Theatre',
    scheduledDays: ['Tue', 'Thu', 'Sat', 'Sun'],
  },
];

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

const ALL_DAYS: DayShort[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  const getDepartmentsByFlag = useDepartmentStore((s) => s.getDepartmentsByFlag);
  const departments = getDepartmentsByFlag({ isClinical: true });
  const departmentCodes = useMemo(() => departments.map((d) => d.typeCode), [departments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEMBERS.filter((m) => {
      if (filter !== 'all' && m.role !== filter) return false;

      if (searchMode === 'name' && q && !m.name.toLowerCase().includes(q)) return false;
      if (searchMode === 'days' && selectedDays.length > 0) {
        if (!selectedDays.every((d) => m.scheduledDays.includes(d))) return false;
      }
      if (searchMode === 'department' && selectedDepts.length > 0) {
        if (!selectedDepts.includes(m.department)) return false;
      }
      return true;
    });
  }, [query, filter, searchMode, selectedDays, selectedDepts]);

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
                options={ALL_DAYS}
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
          <ul className={styles.grid}>
            {filtered.map((m) => (
              <li key={m.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.avatar} aria-hidden>
                    {getUserInitial(m.name.split(' ')[0], m.name.split(' ')[1], '?')}
                  </span>
                  <div>
                    <h2 className={styles.cardName}>{m.name}</h2>
                    <p className={styles.cardRole}>{m.specialization}</p>
                  </div>
                </div>
                <span
                  className={`${styles.roleBadge} ${
                    m.role === 'doctor' ? styles.roleBadgeDoctor : styles.roleBadgeNurse
                  }`}
                >
                  {m.role}
                </span>
                <div className={styles.cardMeta}>
                  <span>
                    Department: <strong>{m.department}</strong>
                  </span>
                </div>
                <div className={styles.dayTags} aria-label='Scheduled days'>
                  {m.scheduledDays.map((d) => (
                    <span key={d} className={styles.dayTag}>
                      {d}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
