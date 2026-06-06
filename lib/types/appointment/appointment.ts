import type { Status } from '../common';
import type { Doctor } from '../doctors';
import type { Nurse } from '../nurses';
import type { Patient } from '../patients';

export interface Appointment {
  appointmentId: string;
  status: Status;
  /** yyyy-MM-dd */
  date: string;
  /** HH:mm */
  timeSlot: string;
  startTime: string | null;
  endTime: string | null;
  patient: Patient;
  doctor: Doctor;
  nurses?: Nurse[];
  concern: string;
  diagnosis?: string | null;
  notes?: string | null;
  room?: string | null;
}
