import { nestApi } from '@/lib/api/nest';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const data = await nestApi.post('auth/signup', body);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sign up failed.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
