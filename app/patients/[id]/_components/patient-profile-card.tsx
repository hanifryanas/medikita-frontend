import type { Patient } from '@/lib/types/patients';
import styles from './patient-profile-card.module.scss';

interface PatientProfileCardProps {
  patient: Patient;
}

export const PatientProfileCard = ({ patient }: PatientProfileCardProps) => (
  <section className={styles.card}>
    <h2 className={styles.cardTitle}>Profile</h2>
    <dl className={styles.detailList}>
      <dt>Phone</dt>
      <dd>{patient.phoneNumber}</dd>
      <dt>Date of birth</dt>
      <dd>{patient.dateOfBirth}</dd>
      {patient.address && (
        <>
          <dt>Address</dt>
          <dd>{patient.address}</dd>
        </>
      )}
      {patient.identityNumber && (
        <>
          <dt>Identity #</dt>
          <dd>{patient.identityNumber}</dd>
        </>
      )}
    </dl>
  </section>
);
