import { nestApi } from '@/lib/api';
import type { Appointment } from '@/lib/types/appointment';
import { NextRequest, NextResponse } from 'next/server';

const extractBearer = (req: NextRequest) => {
  const header = req.headers.get('authorization') ?? '';
  return header.toLowerCase().startsWith('bearer ') ? header.slice(7) : undefined;
};

export async function GET(req: NextRequest) {
  try {
    const token = extractBearer(req);
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    const appointments = await nestApi.get<Appointment[]>('appointments/me', { token });
    return NextResponse.json({ appointments });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch appointments.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
