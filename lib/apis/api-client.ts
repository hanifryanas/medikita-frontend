import { apiFetch } from './api-fetch';
import { FetchOptions } from './fetch-options';

export const apiClient = {
  get: <T>(path: string, options?: Omit<FetchOptions, 'method'>) =>
    apiFetch<T>(path, { ...options, method: 'GET' }),

  post: <T>(
    path: string,
    body: unknown,
    options?: Omit<FetchOptions, 'method' | 'body'>
  ) => apiFetch<T>(path, { ...options, method: 'POST', body }),

  put: <T>(
    path: string,
    body: unknown,
    options?: Omit<FetchOptions, 'method' | 'body'>
  ) => apiFetch<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(
    path: string,
    body: unknown,
    options?: Omit<FetchOptions, 'method' | 'body'>
  ) => apiFetch<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: Omit<FetchOptions, 'method'>) =>
    apiFetch<T>(path, { ...options, method: 'DELETE' }),
};
