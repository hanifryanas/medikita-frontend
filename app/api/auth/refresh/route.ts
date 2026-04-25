import { appConfig } from '@/lib/config/app-config';
import { NextRequest, NextResponse } from 'next/server';

const IS_PROD = appConfig.nodeEnv === 'production';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(Buffer.from(payload, 'base64url').toString());
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
      } else {
        let user: Record<string, unknown> | null = raw.user ?? null;
        if (!user) {
          try {
            const meRes = await fetch(`${appConfig.nestApiBaseUrl}auth/me`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (meRes.ok) user = await meRes.json();
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch current user.';
            return NextResponse.json({ message }, { status: 400 });
          }
        }
        if (!user) {
          const claims = decodeJwtPayload(accessToken);
          user = {
            id: String(claims?.userId ?? claims?.sub ?? ''),
            email: String(claims?.email ?? ''),
            username: String(claims?.username ?? claims?.email ?? claims?.userId ?? ''),
            phoneNumber: claims?.phoneNumber ? String(claims.phoneNumber) : undefined,
          };
        }

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

  let user: Record<string, unknown> | null = null;
  try {
    const meRes = await fetch(`${appConfig.nestApiBaseUrl}auth/me`, {
      headers: { Authorization: `Bearer ${cookieToken}` },
    });
    if (meRes.ok) user = await meRes.json();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch current user.';
    return NextResponse.json({ message }, { status: 400 });
  }

  if (!user) {
    user = {
      id: String(claims.userId ?? claims.sub ?? claims.id ?? ''),
      email: String(claims.email ?? ''),
      username: String(claims.username ?? claims.email ?? claims.userId ?? ''),
      phoneNumber: claims.phoneNumber ? String(claims.phoneNumber) : undefined,
    };
  }

  return NextResponse.json({ accessToken: cookieToken, user });
}
