'use client';

import { buildCareTeamLink } from '@/lib/types/care-teams';
import { DepartmentEmployee } from '@/lib/types/employees/department-employee';
import { EmployeeCard, type EmployeeCardVariant } from '../employees';
import styles from './department-people-section.module.scss';

interface DepartmentPeopleSectionProps {
  title: string;
  employees: DepartmentEmployee[];
  emptyMessage?: string;
  titleId?: string;
  variant?: EmployeeCardVariant;
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
              href={buildCareTeamLink(emp.role, emp.doctor?.doctorId ?? emp.nurse?.nurseId)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>{emptyMessage}</div>
      )}
    </section>
  );
};
