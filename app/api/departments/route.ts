import { nestApi } from '@/lib/api';
import { GroupedDepartmentResult } from '@/lib/api/next/departments/types';
import { DepartmentResult } from '@/lib/api/next/departments/types/department-result';
import { FeaturedDepartment } from '@/lib/types/departments/featured-department';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const departments = await nestApi.get<DepartmentResult[]>('departments');
    const featuredDepartments = await nestApi.get<FeaturedDepartment[]>('departments/featured');
    return NextResponse.json<GroupedDepartmentResult>({ departments, featuredDepartments });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch departments.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
