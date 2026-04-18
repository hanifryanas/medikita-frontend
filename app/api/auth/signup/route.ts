import { NextRequest, NextResponse } from 'next/server';

const NEST_API = process.env.NEST_API_URL!;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const nestRes = await fetch(`${NEST_API}auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!nestRes.ok) {
    const err = await nestRes.json().catch(() => ({ message: nestRes.statusText }));
    return NextResponse.json(err, { status: nestRes.status });
  }

  const data = await nestRes.json();
  return NextResponse.json(data, { status: 201 });
}
