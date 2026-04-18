import { NextRequest, NextResponse } from 'next/server';

const NEST_API = process.env.NEST_API_URL as string;
const IS_PROD = process.env.NODE_ENV === 'production';

interface LoginData {
  token?: string;
  userId: string;
  username: string;
  email?: string;
  role: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id?: string;
    email?: string;
    username?: string;
    phoneNumber?: string;
  };
}

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
  const body = await req.json();
  const isRemember = Boolean(body.isRemember);

  const nestRes = await fetch(`${NEST_API}auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: body.identifier,
      password: body.password,
    }),
  });

  if (!nestRes.ok) {
    const err = await nestRes.json().catch(() => ({ message: nestRes.statusText }));
    return NextResponse.json(err, { status: nestRes.status });
  }

  const loginData: LoginData = await nestRes.json();
  const accessToken = loginData.accessToken ?? loginData.token ?? null;
  const refreshToken = loginData.refreshToken ?? accessToken;

  // Fetch full user profile using the access token
  let user: LoginData['user'] | Record<string, unknown> | null = loginData.user ?? null;

  if (accessToken && !user) {
    user = await fetch(`${NEST_API}auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        return response.json();
      })
      .catch(() => null);
  }

  if (accessToken && !user) {
    const claims = decodeJwtPayload(accessToken);
    user = {
      id: String(claims?.userId ?? claims?.sub ?? loginData.userId ?? ''),
      email: String(claims?.email ?? loginData.email ?? ''),
      username: String(
        claims?.username ??
          claims?.email ??
          loginData.username ??
          claims?.userId ??
          loginData.userId ??
          ''
      ),
      phoneNumber: claims?.phoneNumber ? String(claims.phoneNumber) : undefined,
    };
  }

  if (!user && loginData.userId) {
    user = {
      id: String(loginData.userId),
      email: String(loginData.email ?? ''),
      username: String(loginData.username ?? loginData.email ?? loginData.userId),
    };
  }

  if (refreshToken == null || accessToken == null || user == null) {
    return NextResponse.json({ message: 'Invalid login response from server.' }, { status: 500 });
  }

  const res = NextResponse.json({ accessToken, user });

  res.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    path: '/',
    ...(isRemember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });

  return res;
}
