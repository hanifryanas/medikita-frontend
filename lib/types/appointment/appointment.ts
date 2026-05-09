import type { Status } from '../common';
import type { Doctor } from '../doctors';
import type { Nurse } from '../nurses';
import type { Patient } from '../patients';

export interface Appointment {
  appointmentId: string;
  status: Status;
  startTime: string;
  endTime: string;
  patient: Patient;
  doctor: Doctor;
  nurses?: Nurse[];
  concern: string;
  diagnosis?: string;
  notes?: string;
  room?: string;
}
