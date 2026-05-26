import { nestApi } from '@/lib/api';
import { DoctorResult } from '@/lib/api/next/doctors/types/doctor-result';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/doctors/[id]'>) {
  try {
    const { id } = await ctx.params;
    const doctor = await nestApi.get<DoctorResult>(`doctors/${id}`);
    return NextResponse.json({ doctor });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch doctor.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
