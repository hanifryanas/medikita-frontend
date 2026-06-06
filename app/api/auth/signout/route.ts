import { clearAccessTokenCookie } from '@/lib/auth/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete('refreshToken');
    clearAccessTokenCookie(res);
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sign out failed.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
