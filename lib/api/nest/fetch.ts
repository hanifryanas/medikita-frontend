import { appConfig } from '../../config/app-config';
import { FetchOptions } from '../fetch-options';

export const nestFetch = async <T>(path: string, options: FetchOptions): Promise<T> => {
  const { body, headers, token, ...rest } = options;

  const res = await fetch(`${appConfig.nest.api.baseUrl}${path}`, {
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

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res.text() as Promise<T>;
};
