import { appConfig } from '../config/app-config';
import { FetchOptions } from './fetch-options';

export const nestFetch = async <T>(path: string, options: FetchOptions): Promise<T> => {
  const { body, headers, token, getAccessToken, ...rest } = options;
  void getAccessToken;

  const res = await fetch(`${appConfig.nestApiBaseUrl}${path}`, {
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
    throw new Error(error?.message ?? `Nest API error ${res.status}`);
  }

  return res.json() as Promise<T>;
};
