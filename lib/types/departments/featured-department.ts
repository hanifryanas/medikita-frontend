import type { Department } from './department';

export interface FeaturedDepartment extends Omit<Department, 'content'> {
  featuredOrdinal: number;
}
