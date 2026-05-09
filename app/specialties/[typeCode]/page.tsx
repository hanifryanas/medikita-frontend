'use client';

import { DepartmentIcon } from '@/app/components/departments';
import { PublicNav } from '@/app/components/navigation';
import { useDepartmentStore } from '@/lib/stores';
import type { Employee } from '@/lib/types/employees';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import styles from './page.module.scss';

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

export default function DepartmentDetailPage() {
  const params = useParams<{ typeCode: string }>();
  const typeCode = params?.typeCode;

  const departments = useDepartmentStore((s) => s.departments);
  const isLoaded = useDepartmentStore((s) => s.isLoaded);
  const isLoading = useDepartmentStore((s) => s.isLoading);

  const department = useMemo(
    () => departments.find((d) => d.typeCode === typeCode),
    [departments, typeCode]
  );

  const doctors = useMemo<Employee[]>(
    () => (department?.employees ?? []).filter((e) => e.doctor),
    [department]
  );

  const nurses = useMemo<Employee[]>(
    () => (department?.employees ?? []).filter((e) => e.nurse),
    [department]
  );

  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.content}>
        <Link href='/specialties' className={styles.back}>
          <ChevronLeft size={16} />
          Back to specialties
        </Link>

        {isLoading && !isLoaded && <div className={styles.empty}>Loading…</div>}

        {isLoaded && !department && (
          <div className={styles.empty}>
            We couldn&apos;t find a specialty for &ldquo;{typeCode}&rdquo;.
          </div>
        )}

        {department && (
          <>
            <header className={styles.hero}>
              <div className={styles.iconWrap} aria-hidden='true'>
                <DepartmentIcon name={department.iconName} size={40} />
              </div>
              <div className={styles.heroText}>
                <span className={styles.eyebrow}>Specialty</span>
                <h1 className={styles.heading}>{department.displayName}</h1>
                {department.description && (
                  <p className={styles.subtitle}>{department.description}</p>
                )}
              </div>
            </header>

            {/* Doctors */}
            <section className={styles.section} aria-labelledby='doctors-title'>
              <div className={styles.sectionHeader}>
                <h2 id='doctors-title' className={styles.sectionTitle}>
                  Doctors
                </h2>
                <span className={styles.sectionCount}>{doctors.length}</span>
              </div>

              {doctors.length > 0 ? (
                <ul className={styles.peopleGrid}>
                  {doctors.map((emp) => {
                    const photo = emp.photoUrl ?? emp.user?.photoUrl;
                    const subtitle = emp.doctor?.jobTitle ?? emp.jobTitle;
                    return (
                      <li key={emp.employeeId} className={styles.personCard}>
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className={styles.avatarImg} src={photo} alt='' />
                        ) : (
                          <span className={styles.avatar} aria-hidden='true'>
                            {getInitials(emp.user?.firstName, emp.user?.lastName)}
                          </span>
                        )}
                        <span className={styles.personMeta}>
                          <span className={styles.personName}>{formatDoctorName(emp)}</span>
                          {subtitle && <span className={styles.personRole}>{subtitle}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className={styles.empty}>No physicians listed yet.</div>
              )}
            </section>

            {/* Nurses */}
            {nurses.length > 0 && (
              <section className={styles.section} aria-labelledby='nurses-title'>
                <div className={styles.sectionHeader}>
                  <h2 id='nurses-title' className={styles.sectionTitle}>
                    Nursing team
                  </h2>
                  <span className={styles.sectionCount}>{nurses.length}</span>
                </div>

                <ul className={styles.peopleGrid}>
                  {nurses.map((emp) => {
                    const photo = emp.photoUrl ?? emp.user?.photoUrl;
                    const subtitle = emp.jobTitle ?? 'Nurse';
                    return (
                      <li key={emp.employeeId} className={styles.personCard}>
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className={styles.avatarImg} src={photo} alt='' />
                        ) : (
                          <span className={styles.avatar} aria-hidden='true'>
                            {getInitials(emp.user?.firstName, emp.user?.lastName)}
                          </span>
                        )}
                        <span className={styles.personMeta}>
                          <span className={styles.personName}>
                            {emp.user?.firstName} {emp.user?.lastName}
                          </span>
                          <span className={styles.personRole}>{subtitle}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
