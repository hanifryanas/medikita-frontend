import { nestApi } from '@/lib/api';
import type { Patient } from '@/lib/types/patients';
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
    const patient = await nestApi.post<Patient>('patients/lookup', body, { token });
    return NextResponse.json(patient);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Patient not found.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
