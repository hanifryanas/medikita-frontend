'use client';

import { useAppointments } from '@/lib/stores/appointment-store';
import { Status } from '@/lib/types/common';
import { differenceInMinutes, secondsToMilliseconds } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import styles from './check-in-badge.module.scss';

const CHECK_IN_WINDOW_MINUTES = 120;
const LATE_GRACE_MINUTES = 60;
const TICK_INTERVAL_MS = secondsToMilliseconds(30);

export const CheckInBadge = () => {
  const router = useRouter();
  const appointments = useAppointments();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const eligible = useMemo(
    () =>
      appointments
        .filter((a) => a.status === Status.Incompleted && !a.checkedInAt)
        .filter((a) => {
          const start = new Date(`${a.date}T${a.timeSlot}`);
          const mins = differenceInMinutes(start, now);
          return mins <= CHECK_IN_WINDOW_MINUTES && mins > -LATE_GRACE_MINUTES;
        })
        .sort((a, b) => a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot)),
    [appointments, now]
  );

  if (eligible.length === 0) return null;

  const isMulti = eligible.length > 1;
  const target = eligible[0];
  const patientName = `${target.patient.firstName} ${target.patient.lastName}`.trim();

  const handleClick = () => {
    if (isMulti) {
      router.push('/appointments');
    } else {
      router.push(`/appointments/${target.appointmentId}`);
    }
  };

  return (
    <button type='button' className={styles.badge} onClick={handleClick}>
      <span className={styles.dot} aria-hidden />
      <span className={styles.label}>
        {isMulti ? `${eligible.length} check-ins ready` : `Check in now for ${patientName}`}
      </span>
      <ChevronRight size={14} aria-hidden />
    </button>
  );
};
