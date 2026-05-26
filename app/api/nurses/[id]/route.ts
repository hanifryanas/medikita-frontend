import { nestApi } from '@/lib/api';
import { NurseResult } from '@/lib/api/next/nurses/types/nurse-result';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/nurses/[id]'>) {
  try {
    const { id } = await ctx.params;
    const nurse = await nestApi.get<NurseResult>(`nurses/${id}`);
    return NextResponse.json({ nurse });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch nurse.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
