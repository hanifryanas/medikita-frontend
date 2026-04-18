import { appConfig } from '../config/app-config';
import { FetchOptions } from './fetch-options';

const NEXT_API_BASE_URL = appConfig.nextApiBaseUrl;

const doFetch = async (
  path: string,
  token: string | undefined,
  options: FetchOptions
): Promise<Response> => {
  const { body, headers, getAccessToken, ...rest } = options;
  void getAccessToken;

  return fetch(`${NEXT_API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
};

export const apiFetch = async <T>(path: string, options: FetchOptions = {}): Promise<T> => {
  const { token, getAccessToken } = options;

  let activeToken = token;

  // If no explicit token but a refresh function is provided, try to get one
  if (!activeToken && getAccessToken) {
    activeToken = (await getAccessToken()) ?? undefined;
  }

  let res = await doFetch(path, activeToken, options);

  // Silent token refresh on 401
  if (res.status === 401 && getAccessToken) {
    const refreshed = await getAccessToken();
    if (refreshed) {
      res = await doFetch(path, refreshed, options);
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error?.message ?? `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
};
