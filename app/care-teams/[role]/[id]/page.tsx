'use client';

import { PublicNav } from '@/app/components/navigation';
import { useCareTeam, useCareTeamSchedule } from '@/lib/hooks';
import { useStores } from '@/lib/stores';
import { useOtherPatients, useSelfPatient } from '@/lib/stores/patient-store';
import { useToastStore } from '@/lib/stores/toast-store';
import { AuthStatus } from '@/lib/types/auth';
import { isCareTeamRoleSegment, segmentToCareTeamRole } from '@/lib/types/care-teams';
import { EmployeeRole } from '@/lib/types/employees';
import { formatDate } from '@/lib/utils/formatters';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PatientPickerDialog, ProfileCard, ScheduleSection } from './_components';
import styles from './page.module.scss';

export default function CareTeamDetailPage() {
  const router = useRouter();
  const params = useParams<{ role: string; id: string }>();
  const roleSegment = params?.role;
  const id = params?.id;

  const role =
    roleSegment && isCareTeamRoleSegment(roleSegment)
      ? segmentToCareTeamRole(roleSegment)
      : undefined;

  const { careTeam, isLoading, isLoaded } = useCareTeam(role, id);
  const {
    appointmentStore: { isBooking, createAppointment },
    departmentStore: { getDepartmentByTypeCode },
    authStore: { status: authStatus },
    patientStore: { isLoading: isPatientsLoading },
  } = useStores();
  const pushToast = useToastStore((s) => s.push);
  const selfPatient = useSelfPatient();
  const otherPatients = useOtherPatients();
  const patients = useMemo(
    () => (selfPatient ? [selfPatient, ...otherPatients] : otherPatients),
    [selfPatient, otherPatients]
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const department = careTeam ? getDepartmentByTypeCode(careTeam.departmentTypeCode) : undefined;
  const roleLabel = role === EmployeeRole.Nurse ? 'Nurse' : 'Doctor';
  const isDoctor = role === EmployeeRole.Doctor;

  const schedule = useCareTeamSchedule(careTeam, role);
  const { selectedDate, selectedTime, canBook } = schedule;

  const handleBookingClick = () => {
    if (!canBook) return;
    if (authStatus !== AuthStatus.Authenticated) {
      const next = `${window.location.pathname}${window.location.search}`;
      router.push(`/signin?next=${encodeURIComponent(next)}`);
      return;
    }
    setIsPickerOpen(true);
  };

  const handlePatientConfirm = async (patientId: string, concern: string | null) => {
    if (!careTeam || !selectedDate || !selectedTime || isBooking) return;
    try {
      await createAppointment({
        patientId,
        doctorId: careTeam.careTeamId,
        concern: concern ?? undefined,
        date: formatDate(selectedDate),
        timeSlot: selectedTime,
      });
      setIsPickerOpen(false);
      pushToast('success', 'Appointment booked successfully.');
      router.push('/appointments');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to book appointment.';
      pushToast('error', message);
    }
  };

  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.content}>
        <Link
          href='/care-teams'
          className={styles.back}
          onClick={(e) => {
            if (window.history.length > 1) {
              e.preventDefault();
              router.back();
            }
          }}
        >
          <ChevronLeft size={16} />
          Back
        </Link>

        {!role && (
          <div className={styles.empty}>
            Unknown role &ldquo;{roleSegment}&rdquo;. Expected &ldquo;doctors&rdquo; or
            &ldquo;nurses&rdquo;.
          </div>
        )}

        {role && isLoading && !isLoaded && <div className={styles.empty}>Loadingâ€¦</div>}

        {role && isLoaded && !careTeam && (
          <div className={styles.empty}>
            We couldn&apos;t find a {roleLabel.toLowerCase()} for &ldquo;{id}&rdquo;.
          </div>
        )}

        {careTeam && (
          <>
            <ProfileCard careTeam={careTeam} roleLabel={roleLabel} department={department} />
            <ScheduleSection
              schedule={schedule}
              roleLabel={roleLabel}
              isDoctor={isDoctor}
              onBook={handleBookingClick}
            />
          </>
        )}
      </main>

      <PatientPickerDialog
        open={isPickerOpen}
        patients={patients}
        isLoading={isPatientsLoading}
        isSubmitting={isBooking}
        onClose={() => {
          if (!isBooking) setIsPickerOpen(false);
        }}
        onConfirm={handlePatientConfirm}
      />
    </div>
  );
}
