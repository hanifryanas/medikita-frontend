import { nestApi } from '@/lib/api/nest';
import { appConfig } from '@/lib/config/app-config';
import { SigninData } from '@/lib/types/auth';
import { User } from '@/lib/types/users';
import { NextRequest, NextResponse } from 'next/server';

const IS_PROD = appConfig.node.env === 'production';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const isRemember = Boolean(body.isRemember);

    const signinData = await nestApi.post<SigninData>('auth/signin', {
      identifier: body.identifier,
      password: body.password,
      isRemember,
    });

    const accessToken = signinData.accessToken ?? null;
    const refreshToken = signinData.refreshToken ?? null;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { message: 'Invalid sign in response from server.' },
        { status: 500 }
      );
    }

    const currentUser = await nestApi.get<User>('auth/me', { token: accessToken });

    const res = NextResponse.json({ accessToken, user: currentUser });

    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      path: '/',
      ...(isRemember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
    });

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sign in failed.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
