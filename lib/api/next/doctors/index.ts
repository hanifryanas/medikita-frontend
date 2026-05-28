import { getDoctorById } from './get-doctor-by-id';
import { getDoctorSchedules } from './get-doctor-schedules';
import { getDoctors } from './get-doctors';

export const doctorsNextApi = {
  getDoctors: getDoctors,
  getDoctorById: getDoctorById,
  getDoctorSchedules: getDoctorSchedules,
};
