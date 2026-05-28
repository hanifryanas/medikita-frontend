import type { DoctorScheduleQuery, DoctorScheduleResult } from './types/doctor-schedule-result';

export const getDoctorSchedules = async (
  query: DoctorScheduleQuery = {}
): Promise<DoctorScheduleResult[]> => {
  const params = new URLSearchParams();
  if (query.doctorId) params.set('doctorId', query.doctorId);
  if (query.departmentId !== undefined) params.set('departmentId', String(query.departmentId));
  if (query.startDate) params.set('startDate', query.startDate);
  if (query.endDate) params.set('endDate', query.endDate);

  const search = params.toString();
  const res = await fetch(`/api/doctors/schedules${search ? `?${search}` : ''}`, { method: 'GET' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch doctor schedules.' }));
    throw new Error(err?.message ?? 'Failed to fetch doctor schedules.');
  }

  return (await res.json()).schedules as DoctorScheduleResult[];
};
