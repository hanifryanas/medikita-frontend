import { nestApi } from '@/lib/api';
import type { PatientInsurance } from '@/lib/types/patients';
import { NextRequest, NextResponse } from 'next/server';

const extractBearer = (req: NextRequest) => {
  const header = req.headers.get('authorization') ?? '';
  return header.toLowerCase().startsWith('bearer ') ? header.slice(7) : undefined;
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = extractBearer(req);
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const insurance = await nestApi.post<PatientInsurance>(`patients/${id}/insurances`, body, {
      token,
    });
    return NextResponse.json(insurance);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to add insurance.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
