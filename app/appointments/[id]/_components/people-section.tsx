'use client';

import { Avatar } from '@/app/components/common';
import type { Appointment } from '@/lib/types/appointment';
import type { CareTeam } from '@/lib/types/care-teams';
import { buildCareTeamLink } from '@/lib/types/care-teams';
import { EmployeeRole } from '@/lib/types/employees';
import { formatFullName } from '@/lib/utils/formatters';
import { useRouter } from 'next/navigation';
import type { KeyboardEvent, ReactNode } from 'react';
import styles from './people-section.module.scss';

interface PartyRowProps {
  href?: string;
  avatar: ReactNode;
  name: string;
  meta: string;
  ariaLabel?: string;
}

const PartyRow = ({ href, avatar, name, meta, ariaLabel }: PartyRowProps) => {
  const router = useRouter();
  const handleClick = href ? () => router.push(href) : undefined;
  const handleKey = href
    ? (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(href);
        }
      }
    : undefined;

  return (
    <div
      className={`${styles.partyRow} ${href ? styles.partyRowClickable : ''}`}
      role={href ? 'button' : undefined}
      tabIndex={href ? 0 : undefined}
      aria-label={href ? ariaLabel : undefined}
      onClick={handleClick}
      onKeyDown={handleKey}
    >
      {avatar}
      <div className={styles.partyInfo}>
        <h3 className={styles.partyName}>{name}</h3>
        <span className={styles.partyMeta}>{meta}</span>
      </div>
    </div>
  );
};

interface PeopleSectionProps {
  appointment: Appointment;
  doctorCareTeam?: CareTeam;
}

export const PeopleSection = ({ appointment, doctorCareTeam }: PeopleSectionProps) => {
  const patientName = formatFullName(appointment.patient);
  const doctorName = doctorCareTeam?.displayName ?? appointment.doctor.displayName ?? 'Doctor';
  const doctorSubtitle = doctorCareTeam?.jobTitle;

  const patientHref = `/patients/${appointment.patient.patientId}`;
  const doctorHref = buildCareTeamLink(EmployeeRole.Doctor, appointment.doctor.doctorId);

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>People</h2>

      <PartyRow
        href={patientHref}
        ariaLabel={`Open patient ${patientName}`}
        avatar={
          <Avatar
            name={{
              firstName: appointment.patient.firstName,
              lastName: appointment.patient.lastName,
              fallback: '?',
            }}
            size={44}
          />
        }
        name={patientName}
        meta={`Patient · MRN ${appointment.patient.medicalRecordNumber}`}
      />

      <PartyRow
        href={doctorHref ?? undefined}
        ariaLabel={`Open doctor ${doctorName}`}
        avatar={
          <Avatar
            name={{ fullName: doctorName, fallback: 'D' }}
            photoUrl={doctorCareTeam?.photoUrl}
            size={44}
          />
        }
        name={doctorName}
        meta={`Doctor${doctorSubtitle ? ` · ${doctorSubtitle}` : ''}`}
      />

      {appointment.nurses?.map((nurse) => {
        const nurseName = nurse.employee?.fullName ?? 'Nurse';
        const nurseHref = buildCareTeamLink(EmployeeRole.Nurse, nurse.nurseId);
        return (
          <PartyRow
            key={nurse.nurseId}
            href={nurseHref ?? undefined}
            ariaLabel={`Open nurse ${nurseName}`}
            avatar={
              <Avatar
                name={{ fullName: nurseName, fallback: 'N' }}
                photoUrl={nurse.employee?.photoUrl}
                size={44}
              />
            }
            name={nurseName}
            meta='Nurse'
          />
        );
      })}
    </section>
  );
};
