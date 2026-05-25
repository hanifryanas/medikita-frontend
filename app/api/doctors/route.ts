import { nestApi } from '@/lib/api';
import { DoctorResult } from '@/lib/api/next/doctors/types/doctor-result';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const doctors = await nestApi.get<DoctorResult[]>('doctors');
    return NextResponse.json({ doctors });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch doctors.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
