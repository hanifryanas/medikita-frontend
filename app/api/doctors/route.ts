import { nestApi } from '@/lib/api';
import { Doctor } from '@/lib/types/doctors';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const doctors = await nestApi.get<Doctor[]>('doctors');
    return NextResponse.json({ doctors });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch doctors.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
