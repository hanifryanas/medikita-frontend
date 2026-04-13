export type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  token?: string;
};
