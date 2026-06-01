import { nestApi } from '@/lib/api';
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
    const body = await req.json();
    await nestApi.patch(`patients/${id}`, body, { token });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update patient.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
