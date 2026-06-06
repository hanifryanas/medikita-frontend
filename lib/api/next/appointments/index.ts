import { checkInAppointment } from './check-in-appointment';
import { createAppointment } from './create-appointment';
import { getMyAppointments } from './get-my-appointments';
import { getPatientAppointments } from './get-patient-appointments';

export const appointmentsNextApi = {
  checkInAppointment,
  createAppointment,
  getMyAppointments,
  getPatientAppointments,
};
