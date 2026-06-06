import { PublicNav } from '@/app/components/navigation';
import { nestApi } from '@/lib/api';
import type { DepartmentResult } from '@/lib/api/next/departments/types/department-result';
import type { DoctorResult } from '@/lib/api/next/doctors/types/doctor-result';
import type { NurseResult } from '@/lib/api/next/nurses/types/nurse-result';
import type { CareTeam } from '@/lib/types/care-teams';
import {
    sanitizeDoctorResultToCareTeam,
    sanitizeNurseResultToCareTeam,
} from '@/lib/utils/sanitizers';
import { cacheLife, cacheTag } from 'next/cache';
import { Suspense } from 'react';
import { CareTeamsPageClient } from './_components';
import styles from './page.module.scss';

export const unstable_instant = { prefetch: 'static' } as const;

async function getCareTeams(): Promise<CareTeam[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('care-teams');

  const [doctors, nurses, departments] = await Promise.all([
    nestApi.get<DoctorResult[]>('doctors'),
    nestApi.get<NurseResult[]>('nurses'),
    nestApi.get<DepartmentResult[]>('departments'),
  ]);

  const departmentByCode = new Map(
    departments.map((d) => [d.typeCode, { displayName: d.displayName, iconName: d.iconName }])
  );

  return [
    ...doctors.map((d) => sanitizeDoctorResultToCareTeam(d, departmentByCode)),
    ...nurses.map((n) => sanitizeNurseResultToCareTeam(n, departmentByCode)),
  ];
}

const CareTeamsContent = async () => {
  const careTeams = await getCareTeams();
  return <CareTeamsPageClient initialCareTeams={careTeams} />;
};

const CareTeamsGridSkeleton = () => (
  <div className={styles.grid} aria-busy>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className={styles.skeletonCard} aria-hidden />
    ))}
  </div>
);

export default function CareTeamsPage() {
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

        <Suspense fallback={<CareTeamsGridSkeleton />}>
          <CareTeamsContent />
        </Suspense>
      </main>
    </div>
  );
}
