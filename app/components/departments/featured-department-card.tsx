'use client';

import type { Department } from '@/lib/types/departments';
import type { Employee } from '@/lib/types/employees';
import { getSeniorDoctorEmployees } from '@/lib/utils/departments';
import Link from 'next/link';
import { DepartmentIcon } from './department-icon';
import styles from './featured-department-card.module.scss';

interface FeaturedDepartmentCardProps {
  department: Department;
  /** Maximum number of senior doctors to show. Default 2. */
  maxDoctors?: number;
}

const getInitials = (firstName?: string, lastName?: string): string => {
  const f = firstName?.[0] ?? '';
  const l = lastName?.[0] ?? '';
  return `${f}${l}`.toUpperCase() || '?';
};

const formatDoctorName = (employee: Employee): string => {
  const first = employee.user?.firstName ?? '';
  const last = employee.user?.lastName ?? '';
  const title = employee.doctor?.title;
  const base = `dr. ${first} ${last}`.replace(/\s+/g, ' ').trim();
  return title ? `${base}, ${title}` : base;
};

export const FeaturedDepartmentCard = ({
  department,
  maxDoctors = 3,
}: FeaturedDepartmentCardProps) => {
  const seniorDoctors = getSeniorDoctorEmployees(department, maxDoctors);

  return (
    <Link href={`/specialties/${department.typeCode}`} className={styles.card}>
      <header className={styles.header}>
        <div className={styles.iconWrap} aria-hidden='true'>
          <DepartmentIcon name={department.iconName} size={28} />
        </div>
        <div className={styles.titleGroup}>
          <span className={styles.eyebrow}>Specialty</span>
          <h3 className={styles.title}>{department.displayName}</h3>
        </div>
      </header>

      {department.description && <p className={styles.description}>{department.description}</p>}

      <div className={styles.doctors}>
        <span className={styles.doctorsLabel}>Leading Specialists</span>
        {seniorDoctors.length > 0 ? (
          <ul className={styles.doctorList}>
            {seniorDoctors.map((emp) => {
              const photo = emp.photoUrl ?? emp.user?.photoUrl;
              const name = formatDoctorName(emp);
              const subtitle = emp.doctor?.jobTitle ?? emp.jobTitle;

              return (
                <li key={emp.employeeId} className={styles.doctorRow}>
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={styles.avatarImg} src={photo} alt='' />
                  ) : (
                    <span className={styles.avatar} aria-hidden='true'>
                      {getInitials(emp.user?.firstName, emp.user?.lastName)}
                    </span>
                  )}
                  <span className={styles.doctorMeta}>
                    <span className={styles.doctorName}>{name}</span>
                    {subtitle && <span className={styles.doctorTitle}>{subtitle}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <span className={styles.emptyDoctors}>Doctor roster coming soon.</span>
        )}
      </div>
    </Link>
  );
};
