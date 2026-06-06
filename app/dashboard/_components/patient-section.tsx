'use client';

import { useOtherPatients, useSelfPatient } from '@/lib/stores/patient-store';
import type { Patient } from '@/lib/types/patients';
import { useMemo } from 'react';
import { DashboardSection } from './dashboard-section';
import { PatientRow } from './patient-row';

const MAX_ROWS = 4;

export const PatientSection = () => {
  const selfPatient = useSelfPatient();
  const otherPatients = useOtherPatients();

  const patients = useMemo(() => {
    const list: Patient[] = [];
    if (selfPatient) list.push(selfPatient);
    list.push(...otherPatients);
    return list.slice(0, MAX_ROWS);
  }, [selfPatient, otherPatients]);

  return (
    <DashboardSection title='My patients' actionLabel='Manage' actionHref='/patients'>
      {patients.length === 0 ? (
        <p style={{ margin: 0, padding: '0.5rem 0', color: 'var(--text-muted)' }}>
          No patients linked yet.
        </p>
      ) : (
        patients.map((p) => <PatientRow key={p.patientId} patient={p} />)
      )}
    </DashboardSection>
  );
};
