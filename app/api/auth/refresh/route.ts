import { nestApi } from '@/lib/api/nest';
import { AccountUser } from '@/lib/types/users';
import { NextRequest, NextResponse } from 'next/server';

const clearRefreshCookie = (res: NextResponse) => {
  res.cookies.set('refreshToken', '', { path: '/', maxAge: 0 });
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
    console.error('[refresh] Failed to fetch user:', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ accessToken, user });
}
