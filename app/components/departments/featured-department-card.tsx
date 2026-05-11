'use client';

import { FeaturedDepartment } from '@/lib/types/departments/featured-department';
import Link from 'next/link';
import { EmployeeCard } from '../employees';
import { DepartmentIcon } from './department-icon';
import styles from './featured-department-card.module.scss';

interface FeaturedDepartmentCardProps {
  department: FeaturedDepartment;
}

export const FeaturedDepartmentCard = ({ department }: FeaturedDepartmentCardProps) => {
  const featuredEmployees = department.employees ?? [];
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
        {featuredEmployees.length > 0 ? (
          <div className={styles.doctorList}>
            {featuredEmployees.map((emp) => (
              <EmployeeCard key={emp.employeeId} employee={emp} />
            ))}
          </div>
        ) : (
          <span className={styles.emptyDoctors}>Doctor roster coming soon.</span>
        )}
      </div>
    </Link>
  );
};
