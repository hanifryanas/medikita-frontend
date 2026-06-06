import { nestApi } from '@/lib/api/nest';
import { HydrateResult } from '@/lib/api/next/auth/types/hydrate-result';
import { clearAccessTokenCookie, setAccessTokenCookie } from '@/lib/auth/server';
import { AccountUser } from '@/lib/types/users';
import { NextRequest, NextResponse } from 'next/server';

const clearRefreshCookie = (res: NextResponse) => {
  res.cookies.set('refreshToken', '', { path: '/', maxAge: 0 });
  clearAccessTokenCookie(res);
  return res;
};

export async function POST(req: NextRequest) {
  const cookieToken = req.cookies.get('refreshToken')?.value;

  if (!cookieToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  let accessToken: string;

  try {
    const tokenResponse = await nestApi.post<{ accessToken?: string }>('auth/refresh', {
      refreshToken: cookieToken,
    });

    if (!tokenResponse.accessToken) {
      return clearRefreshCookie(
        NextResponse.json({ message: 'No access token in refresh response.' }, { status: 500 })
      );
    }

    accessToken = tokenResponse.accessToken;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Refresh token failed.';
    return clearRefreshCookie(NextResponse.json({ message }, { status: 400 }));
  }

  let user: AccountUser | null = null;

  try {
    user = await nestApi.get<AccountUser>('auth/me', { token: accessToken });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch user.';
    return clearRefreshCookie(NextResponse.json({ message }, { status: 500 }));
  }

  const res = NextResponse.json<HydrateResult>({ accessToken, user });
  setAccessTokenCookie(res, accessToken);
  return res;
}
