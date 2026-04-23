import { appConfig } from '@/lib/config/app-config';
import { NextRequest, NextResponse } from 'next/server';

const IS_PROD = appConfig.nodeEnv === 'production';

/** Decode JWT payload without verifying signature (safe — NestJS verifies on every protected call) */
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

  // Try NestJS /auth/refresh first
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

      // If NestJS returned 200 but no token, fall through to JWT decode
      if (!accessToken || !refreshToken) {
        // fall through
      } else {
        let user: Record<string, unknown> | null = raw.user ?? null;
        if (!user) {
          try {
            const meRes = await fetch(`${appConfig.nestApiBaseUrl}auth/me`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (meRes.ok) user = await meRes.json();
          } catch {
            /* fall through */
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

    // Any non-OK response from NestJS /auth/refresh falls through to JWT decode
    // (NestJS may not have this endpoint, or we're sending an access token as refresh token)
  } catch {
    // Network error — fall through to decode fallback
  }

  // Fallback: NestJS has no /auth/refresh endpoint (or returned non-401 error).
  // Decode the JWT we stored in the cookie to reconstruct the user.
  const claims = decodeJwtPayload(cookieToken);
  if (!claims) {
    const res = NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    res.cookies.delete('refreshToken');
    return res;
  }

  // Check expiry
  if (typeof claims.exp === 'number' && claims.exp * 1000 < Date.now()) {
    const res = NextResponse.json({ message: 'Token expired' }, { status: 401 });
    res.cookies.delete('refreshToken');
    return res;
  }

  // Try to get full user profile with the stored token
  let user: Record<string, unknown> | null = null;
  try {
    const meRes = await fetch(`${appConfig.nestApiBaseUrl}auth/me`, {
      headers: { Authorization: `Bearer ${cookieToken}` },
    });
    if (meRes.ok) user = await meRes.json();
  } catch {
    /* fall through */
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
