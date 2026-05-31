import { nestApi } from '@/lib/api';
import type { Patient } from '@/lib/types/patients';
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

    const patients = await nestApi.get<Patient[]>('patients/me', { token });
    return NextResponse.json({ patients });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch patients.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
