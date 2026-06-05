import { useAuthStore } from '@/lib/stores/auth-store';

interface NextFetchOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: Record<string, string>;
  isPublic?: boolean;
  errorMessage?: string;
}

export const nextFetch = async <T>(path: string, options: NextFetchOptions = {}): Promise<T> => {
  const { body, headers, errorMessage, isPublic, ...rest } = options;
  const accessToken = isPublic ? null : useAuthStore.getState().accessToken;

  const res = await fetch(path, {
    ...rest,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const fallback = errorMessage ?? `Request failed (${res.status}).`;
    const err = await res.json().catch(() => ({ message: fallback }));
    throw new Error(err?.message ?? fallback);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
};
