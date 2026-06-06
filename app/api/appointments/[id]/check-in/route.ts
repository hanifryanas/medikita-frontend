import { nestApi } from '@/lib/api';
import type { Appointment } from '@/lib/types/appointment';
import { NextRequest, NextResponse } from 'next/server';

const extractBearer = (req: NextRequest) => {
  const header = req.headers.get('authorization') ?? '';
  return header.toLowerCase().startsWith('bearer ') ? header.slice(7) : undefined;
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = extractBearer(req);
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }

    const { id } = await params;
    const appointment = await nestApi.patch<Appointment>(
      `appointments/${id}/check-in`,
      {},
      { token }
    );
    return NextResponse.json({ appointment });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to check in.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
