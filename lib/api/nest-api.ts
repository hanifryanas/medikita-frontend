import { FetchOptions } from './fetch-options';
import { nestFetch } from './nest-fetch';

export const nestApi = {
  get: <T>(path: string, options?: Omit<FetchOptions, 'method'>) =>
    nestFetch<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: unknown, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    nestFetch<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body: unknown, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    nestFetch<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body: unknown, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    nestFetch<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: Omit<FetchOptions, 'method'>) =>
    nestFetch<T>(path, { ...options, method: 'DELETE' }),
};
