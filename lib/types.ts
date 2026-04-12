// ─── Shared API response shape from NestJS ─────────────────────────────────

export interface ApiList<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// ─── Add your domain types below as the backend grows ───────────────────────

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  imageUrl?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
