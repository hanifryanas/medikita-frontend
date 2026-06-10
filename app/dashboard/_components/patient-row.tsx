'use client';

import { Avatar } from '@/app/components/common';
import type { Patient } from '@/lib/types/patients';
import { UserRelationship } from '@/lib/types/users';
import { USER_RELATIONSHIP_LABEL } from '@/lib/utils/formatters';
import { SummaryRow } from './summary-row';

interface PatientRowProps {
  patient: Patient;
}

export const PatientRow = ({ patient }: PatientRowProps) => {
  const relationship = patient.relationship ?? UserRelationship.Other;
  const isSelf = relationship === UserRelationship.Self;
  const fullName = `${patient.firstName} ${patient.lastName}`.trim();

  return (
    <SummaryRow
      leading={
        <Avatar
          name={{ firstName: patient.firstName, lastName: patient.lastName, fallback: '?' }}
          size={40}
        />
      }
      title={fullName}
      metaItems={[`MRN ${patient.medicalRecordNumber}`, `${patient.age} yrs`]}
      badge={{
        label: USER_RELATIONSHIP_LABEL[relationship],
        tone: isSelf ? 'accent' : 'neutral',
      }}
    />
  );
};
