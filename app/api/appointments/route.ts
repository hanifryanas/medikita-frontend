import { nestApi } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

const extractBearer = (req: NextRequest) => {
  const header = req.headers.get('authorization') ?? '';
  return header.toLowerCase().startsWith('bearer ') ? header.slice(7) : undefined;
};

export async function POST(req: NextRequest) {
  try {
    const token = extractBearer(req);
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    const body = await req.json();
    const appointmentId = await nestApi.post<string>('appointments', body, { token });
    return NextResponse.json({ appointmentId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to book appointment.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
