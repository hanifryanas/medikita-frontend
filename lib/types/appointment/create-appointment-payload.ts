export interface CreateAppointmentPayload {
  patientId: string;
  doctorId: string;
  concern?: string;
  date: string;
  timeSlot: string;
}
