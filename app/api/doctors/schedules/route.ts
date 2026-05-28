import { nestApi } from '@/lib/api';
import type { DoctorScheduleResult } from '@/lib/api/next/doctors/types/doctor-schedule-result';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_QUERY_KEYS = ['doctorId', 'departmentId', 'startDate', 'endDate'] as const;

export async function GET(req: NextRequest) {
  try {
    const params = new URLSearchParams();
    for (const key of ALLOWED_QUERY_KEYS) {
      const value = req.nextUrl.searchParams.get(key);
      if (value !== null && value !== '') params.set(key, value);
    }
    const query = params.toString();
    const schedules = await nestApi.get<DoctorScheduleResult[]>(
      `doctors/schedules${query ? `?${query}` : ''}`
    );
    return NextResponse.json({ schedules });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch doctor schedules.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
