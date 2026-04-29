import { appConfig } from '@/lib/config/app-config';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const cookieToken = req.cookies.get('refreshToken')?.value;

  if (!cookieToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  let accessToken: string;

  try {
    const nestRes = await fetch(`${appConfig.nest.api.baseUrl}auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: cookieToken }),
    });

    if (!nestRes.ok) {
      const err = await nestRes.json().catch(() => ({ message: 'Refresh failed.' }));
      return NextResponse.json(
        { message: err?.message ?? 'Refresh failed.' },
        { status: nestRes.status }
      );
    }

    const raw = await nestRes.json();
    accessToken = raw.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'No access token in refresh response.' },
        { status: 500 }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Refresh token failed.';
    return NextResponse.json({ message }, { status: 400 });
  }

  let user = null;

  try {
    const userRes = await fetch(`${appConfig.nest.api.baseUrl}auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (userRes.ok) {
      user = await userRes.json();
    }
  } catch (err) {
    console.error('[refresh] Failed to fetch user:', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ accessToken, user });
}
