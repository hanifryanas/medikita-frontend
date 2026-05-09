'use client';

import { Carousel } from '@/app/components/common';
import { DepartmentTile, FeaturedDepartmentCard } from '@/app/components/departments';
import { PublicNav } from '@/app/components/navigation';
import { useDepartmentStore } from '@/lib/stores';
import { useMemo } from 'react';
import styles from './page.module.scss';

export default function SpecialtiesPage() {
  const departments = useDepartmentStore((s) => s.departments);
  const featured = useDepartmentStore((s) => s.featuredDepartments);
  const isLoading = useDepartmentStore((s) => s.isLoading);
  const isLoaded = useDepartmentStore((s) => s.isLoaded);

  const otherClinics = useMemo(() => {
    const featuredIds = new Set(featured.map((d) => d.departmentId));
    return departments
      .filter((d) => d.isClinic && d.isActive && !featuredIds.has(d.departmentId))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [departments, featured]);

  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.content}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Our Specialties</span>
          <h1 className={styles.heading}>Care that meets every need</h1>
          <p className={styles.subtitle}>
            From flagship centers to everyday clinics — care for every stage of life.
          </p>
        </header>

        {/* ── Featured Specialties ── */}
        <section className={styles.section} aria-labelledby='featured-title'>
          <div className={styles.sectionHeader}>
            <h2 id='featured-title' className={styles.sectionTitle}>
              Featured specialties
            </h2>
            <p className={styles.sectionCaption}>
              Specialty centers built around our most trusted clinicians.
            </p>
          </div>

          {isLoading && !isLoaded && <div className={styles.empty}>Loading specialties…</div>}

          {isLoaded && featured.length === 0 && (
            <div className={styles.empty}>No featured specialties yet.</div>
          )}

          {featured.length > 0 && (
            <div className={styles.featuredGrid}>
              {featured.map((department) => (
                <FeaturedDepartmentCard key={department.departmentId} department={department} />
              ))}
            </div>
          )}
        </section>

        {/* ── Other clinics ── */}
        <section className={styles.section} aria-labelledby='clinics-title'>
          <div className={styles.sectionHeader}>
            <h2 id='clinics-title' className={styles.sectionTitle}>
              All clinics
            </h2>
            <p className={styles.sectionCaption}>
              The full roster of outpatient clinics, ready when you need them.
            </p>
          </div>

          {isLoaded && otherClinics.length === 0 && (
            <div className={styles.empty}>No additional clinics to show.</div>
          )}

          {otherClinics.length > 0 && (
            <Carousel ariaLabel='All clinics'>
              {otherClinics.map((department) => (
                <DepartmentTile key={department.departmentId} department={department} />
              ))}
            </Carousel>
          )}
        </section>
      </main>
    </div>
  );
}
