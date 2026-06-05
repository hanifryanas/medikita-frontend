import { nestApi } from '@/lib/api';
import {
  FeaturedDepartmentResult,
  GroupedDepartmentResult,
} from '@/lib/api/next/departments/types';
import { DepartmentResult } from '@/lib/api/next/departments/types/department-result';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const departments = await nestApi.get<DepartmentResult[]>('departments');
    const featuredDepartments =
      await nestApi.get<FeaturedDepartmentResult[]>('departments/featured');
    return NextResponse.json<GroupedDepartmentResult>({ departments, featuredDepartments });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch departments.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
