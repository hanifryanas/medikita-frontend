import { nestApi } from '@/lib/api';
import { Department } from '@/lib/types/departments';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const departments = await nestApi.get<Department[]>('departments');
    const featuredDepartments = await nestApi.get<Department[]>('departments/featured');
    return NextResponse.json({ departments, featuredDepartments });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch departments.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
