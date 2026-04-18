import { appConfig } from '../config/app-config';
import { FetchOptions } from './fetch-options';

const BASE_URL = appConfig.apiUrl;

export const apiFetch = async <T>(path: string, options: FetchOptions = {}): Promise<T> => {
  const { body, headers, token, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error?.message ?? `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
};
