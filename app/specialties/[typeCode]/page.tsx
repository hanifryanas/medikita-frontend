'use client';

import {
  DepartmentContentSection,
  DepartmentIcon,
  DepartmentPeopleSection,
} from '@/app/components/departments';
import { PublicNav } from '@/app/components/navigation';
import { useStores } from '@/lib/stores';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.scss';

export default function DepartmentDetailPage() {
  const params = useParams<{ typeCode: string }>();
  const typeCode = params?.typeCode;
  const {
    departmentStore: {
      isLoading,
      isLoaded,
      getDepartmentByTypeCode,
      departmentDoctorEmployeeMap,
      departmentNurseEmployeeMap,
    },
  } = useStores();

  const department = getDepartmentByTypeCode(typeCode);
  const doctors = departmentDoctorEmployeeMap.get(typeCode) ?? [];
  const nurses = departmentNurseEmployeeMap.get(typeCode) ?? [];
  const content = department?.content;

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

            <div className={styles.layout}>
              <aside className={styles.leftPane} aria-label='Department information'>
                <DepartmentContentSection content={content} />
              </aside>

              <div className={styles.rightPane}>
                <DepartmentPeopleSection title='Doctors' employees={doctors} variant='card' />
                <DepartmentPeopleSection title='Nursing team' employees={nurses} variant='card' />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
