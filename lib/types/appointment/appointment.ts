export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
