import { appConfig } from '@/lib/config/app-config';
import { decodeJwtPayload } from '@/lib/utils/jwt';
import { NextRequest, NextResponse } from 'next/server';

const IS_PROD = appConfig.nodeEnv === 'production';

function buildUserFromClaims(claims: Record<string, unknown>): Record<string, unknown> {
  return {
    id: String(claims.userId ?? claims.sub ?? claims.id ?? ''),
    email: String(claims.email ?? ''),
    username: String(claims.username ?? claims.email ?? claims.userId ?? ''),
    phoneNumber: claims.phoneNumber ? String(claims.phoneNumber) : undefined,
  };
}

async function fetchUserByToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${appConfig.nestApiBaseUrl}auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return (await res.json()) as Record<string, unknown>;
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const cookieToken = req.cookies.get('refreshToken')?.value;

  if (!cookieToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  try {
    const nestRes = await fetch(`${appConfig.nestApiBaseUrl}auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: cookieToken }),
    });

    if (nestRes.ok) {
      const raw = await nestRes.json();
      const accessToken: string = raw.accessToken ?? raw.token;
      const refreshToken: string = raw.refreshToken ?? raw.token;

      if (!accessToken || !refreshToken) {
        return NextResponse.json(
          { message: 'Invalid refresh response from server.' },
          { status: 500 }
        );
      }

      const user =
        (raw.user as Record<string, unknown> | null | undefined) ??
        (await fetchUserByToken(accessToken)) ??
        buildUserFromClaims(decodeJwtPayload(accessToken) ?? {});

      const res = NextResponse.json({ accessToken, user });
      res.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Refresh token failed.';
    return NextResponse.json({ message }, { status: 400 });
  }

  const claims = decodeJwtPayload(cookieToken);
  if (!claims) {
    const res = NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    res.cookies.delete('refreshToken');
    return res;
  }

  if (typeof claims.exp === 'number' && claims.exp * 1000 < Date.now()) {
    const res = NextResponse.json({ message: 'Token expired' }, { status: 401 });
    res.cookies.delete('refreshToken');
    return res;
  }

  const user = (await fetchUserByToken(cookieToken)) ?? buildUserFromClaims(claims);

  return NextResponse.json({ accessToken: cookieToken, user });
}
