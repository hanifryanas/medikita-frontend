'use client';

import { Avatar } from '@/app/components/common';
import type { Employee } from '@/lib/types/employees';
import Link from 'next/link';
import styles from './employee-card.module.scss';

export type EmployeeCardVariant = 'row' | 'card';

export type EmployeeCardEmployee = Pick<Employee, 'employeeId' | 'fullName' | 'displayName'> &
  Partial<Pick<Employee, 'user' | 'doctor' | 'photoUrl' | 'jobTitle'>>;

interface EmployeeCardProps<T extends EmployeeCardEmployee = Employee> {
  employee: T;
  variant?: EmployeeCardVariant;
  name?: string;
  subtitle?: string;
  avatarSize?: number;
  className?: string;
  href?: string;
}

export const EmployeeCard = <T extends EmployeeCardEmployee = Employee>({
  employee,
  variant = 'row',
  name,
  subtitle,
  avatarSize,
  className,
  href,
}: EmployeeCardProps<T>) => {
  const photoUrl = employee.photoUrl ?? employee.user?.photoUrl;
  const displayName = name ?? employee.displayName ?? employee.fullName;
  const displaySubtitle = subtitle ?? employee.doctor?.jobTitle ?? employee.jobTitle;
  const size = avatarSize ?? (variant === 'card' ? 56 : 32);

  const rootClass = [styles.root, styles[variant], href && styles.linked, className]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <Avatar
        photoUrl={photoUrl}
        name={{ fullName: employee.fullName, fallback: '?' }}
        size={size}
        className={styles.avatarRoot}
        imageClassName={styles.avatarImg}
        initialClassName={styles.avatar}
        style={{ width: size, height: size }}
      />
      <span className={styles.meta}>
        <span className={styles.name}>{displayName}</span>
        {displaySubtitle && <span className={styles.subtitle}>{displaySubtitle}</span>}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={rootClass}>
        {inner}
      </Link>
    );
  }

  return <div className={rootClass}>{inner}</div>;
};
