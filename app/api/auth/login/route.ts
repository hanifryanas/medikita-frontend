import { nestApi } from '@/lib/api';
import { appConfig } from '@/lib/config/app-config';
import { LoginData } from '@/lib/types/auth';
import { User } from '@/lib/types/users';
import { NextRequest, NextResponse } from 'next/server';

const IS_PROD = appConfig.nodeEnv === 'production';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const isRemember = Boolean(body.isRemember);

  const loginData = await nestApi.post<LoginData>('auth/login', {
    identifier: body.identifier,
    password: body.password,
    isRemember,
  });

  const accessToken = loginData.accessToken ?? null;
  const refreshToken = loginData.refreshToken ?? null;

  if (!accessToken) {
    return NextResponse.json({ message: 'Invalid login response from server.' }, { status: 500 });
  }

  const currentUser = await nestApi.get<User>('auth/me', { token: accessToken });

  const res = NextResponse.json({ accessToken, user: currentUser });

  if (refreshToken) {
    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      path: '/',
      ...(isRemember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
    });
  }

  return res;
}
