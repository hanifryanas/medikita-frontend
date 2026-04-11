const BASE_URL = process.env.API_URL ?? "http://localhost:3000";

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, headers, token, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
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
}

export const api = {
  get: <T>(path: string, options?: Omit<FetchOptions, "method">) =>
    apiFetch<T>(path, { ...options, method: "GET" }),

  post: <T>(
    path: string,
    body: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) => apiFetch<T>(path, { ...options, method: "POST", body }),

  put: <T>(
    path: string,
    body: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) => apiFetch<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(
    path: string,
    body: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) => apiFetch<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, options?: Omit<FetchOptions, "method">) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};
