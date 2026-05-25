import { nestApi } from '@/lib/api';
import { NurseResult } from '@/lib/api/next/nurses/types/nurse-result';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const nurses = await nestApi.get<NurseResult[]>('nurses');
    return NextResponse.json({ nurses });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch nurses.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
