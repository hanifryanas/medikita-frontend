export interface ApiList<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
