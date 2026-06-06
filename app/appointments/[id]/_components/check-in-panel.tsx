'use client';

import { useAppointmentStore } from '@/lib/stores/appointment-store';
import { useToastStore } from '@/lib/stores/toast-store';
import type { Appointment } from '@/lib/types/appointment';
import { Status } from '@/lib/types/common';
import { formatDate } from '@/lib/utils/formatters';
import { differenceInMinutes } from 'date-fns';
import { CheckCircle2, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from '../page.module.scss';

const CHECK_IN_WINDOW_MINUTES = 120;

interface CheckInPanelProps {
  appointment: Appointment;
}

const formatMinutesUntil = (minutes: number) => {
  if (minutes <= 0) return 'Starting now';
  if (minutes < 60) return `in ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `in ${hours}h`;
  return `in ${hours}h ${remaining}m`;
};

export const CheckInPanel = ({ appointment }: CheckInPanelProps) => {
  const pushToast = useToastStore((s) => s.push);
  const isPending = useAppointmentStore((s) => s.checkInPending.has(appointment.appointmentId));
  const checkInError = useAppointmentStore((s) => s.checkInError);
  const checkInAppointment = useAppointmentStore((s) => s.checkInAppointment);
  const clearCheckInError = useAppointmentStore((s) => s.clearCheckInError);

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const start = new Date(`${appointment.date}T${appointment.timeSlot}`);
  const minutesUntilStart = differenceInMinutes(start, now);
  const isCheckedIn = Boolean(appointment.checkedInAt);
  const isCancelled = appointment.status === Status.Cancelled;
  const isCompleted = appointment.status === Status.Completed;
  const withinWindow = minutesUntilStart <= CHECK_IN_WINDOW_MINUTES && minutesUntilStart > -60;
  const canCheckIn = !isCheckedIn && !isCancelled && !isCompleted && withinWindow;

  const handleCheckIn = async () => {
    if (!canCheckIn || isPending) return;
    try {
      await checkInAppointment(appointment.appointmentId);
      pushToast('success', 'Checked in successfully.');
    } catch {
      // error is exposed via checkInError; toast on failure for visibility
      pushToast('error', 'Failed to check in.');
    }
  };

  if (isCheckedIn && appointment.checkedInAt) {
    return (
      <section className={styles.checkIn}>
        <div className={styles.checkInHead}>
          <CheckCircle2 size={18} aria-hidden />
          Checked in
        </div>
        <p className={styles.checkInBody}>
          You checked in {formatDate(new Date(appointment.checkedInAt), 'd MMM yyyy, HH:mm')}.
          Please wait to be called by the front desk.
        </p>
      </section>
    );
  }

  if (isCancelled) {
    return (
      <section className={styles.checkIn}>
        <div className={styles.checkInHead}>Check-in unavailable</div>
        <p className={styles.checkInBody}>This appointment was cancelled.</p>
      </section>
    );
  }

  if (isCompleted) {
    return (
      <section className={styles.checkIn}>
        <div className={styles.checkInHead}>Visit completed</div>
        <p className={styles.checkInBody}>Hope your visit went well.</p>
      </section>
    );
  }

  return (
    <section className={styles.checkIn}>
      <div className={styles.checkInHead}>
        <LogIn size={18} aria-hidden />
        Check in
      </div>
      <p className={styles.checkInBody}>
        Check-in opens 2 hours before your appointment.{' '}
        {canCheckIn
          ? 'You can check in now.'
          : minutesUntilStart > CHECK_IN_WINDOW_MINUTES
            ? `Available ${formatMinutesUntil(minutesUntilStart - CHECK_IN_WINDOW_MINUTES)}.`
            : 'The check-in window has closed.'}
      </p>
      <div className={styles.checkInRow}>
        <button
          type='button'
          className={styles.checkInButton}
          onClick={handleCheckIn}
          disabled={!canCheckIn || isPending}
        >
          <LogIn size={16} aria-hidden />
          {isPending ? 'Checking in…' : 'Check in now'}
        </button>
      </div>
      {checkInError && (
        <p className={styles.checkInError} onAnimationEnd={clearCheckInError}>
          {checkInError}
        </p>
      )}
    </section>
  );
};
