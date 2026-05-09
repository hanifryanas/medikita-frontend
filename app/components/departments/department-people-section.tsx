'use client';

import type { Employee } from '@/lib/types/employees';
import { EmployeeCard, type EmployeeCardVariant } from '../employees';
import styles from './department-people-section.module.scss';

interface DepartmentPeopleSectionProps {
  /** Heading shown above the grid (e.g. "Doctors", "Nursing team"). */
  title: string;
  employees: Employee[];
  /** Message to show when `employees` is empty. If omitted the section is hidden. */
  emptyMessage?: string;
  /** Stable id for ARIA labelling. Falls back to a slug of the title. */
  titleId?: string;
  /** Card layout variant. `row` for compact lists, `card` (tile) for richer grids. Default `row`. */
  variant?: EmployeeCardVariant;
  /** Optional per-card name override, e.g. to prefix "dr." for doctors. */
  formatName?: (employee: Employee) => string;
  /** Optional per-card subtitle override (e.g. fallback role label). */
  formatSubtitle?: (employee: Employee) => string | undefined;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const DepartmentPeopleSection = ({
  title,
  employees,
  emptyMessage,
  titleId,
  variant = 'row',
  formatName,
  formatSubtitle,
}: DepartmentPeopleSectionProps) => {
  if (employees.length === 0 && !emptyMessage) return null;

  const headingId = titleId ?? `${slugify(title)}-title`;
  const gridClass = [styles.grid, styles[`grid_${variant}`]].filter(Boolean).join(' ');

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.header}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        <span className={styles.count}>{employees.length}</span>
      </div>

      {employees.length > 0 ? (
        <div className={gridClass}>
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.employeeId}
              employee={emp}
              variant={variant}
              name={formatName?.(emp)}
              subtitle={formatSubtitle?.(emp)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>{emptyMessage}</div>
      )}
    </section>
  );
};
