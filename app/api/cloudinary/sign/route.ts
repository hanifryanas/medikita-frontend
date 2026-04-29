import { appConfig } from '@/lib/config/app-config';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { paramsToSign } = await req.json();

  const { apiSecret } = appConfig.cloudinary;
  if (!apiSecret) {
    return NextResponse.json({ message: 'Cloudinary not configured.' }, { status: 500 });
  }

  const encoder = new TextEncoder();
  const sorted = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join('&');

  const data = encoder.encode(sorted + apiSecret);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return NextResponse.json({ signature });
}
