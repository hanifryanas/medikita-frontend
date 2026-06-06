import { appConfig } from '@/lib/config/app-config';
import { hoursToSeconds } from 'date-fns';
import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

export const ACCESS_TOKEN_COOKIE = 'accessToken';
const IS_PROD = appConfig.node.env === 'production';

const DEFAULT_MAX_AGE_SECONDS = hoursToSeconds(1);

export const setAccessTokenCookie = (
  res: NextResponse,
  token: string,
  maxAgeSeconds: number = DEFAULT_MAX_AGE_SECONDS
) => {
  res.cookies.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
  });
};

export const clearAccessTokenCookie = (res: NextResponse) => {
  res.cookies.set(ACCESS_TOKEN_COOKIE, '', { path: '/', maxAge: 0 });
};

export const getAccessTokenFromCookies = async (): Promise<string | null> => {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
};
