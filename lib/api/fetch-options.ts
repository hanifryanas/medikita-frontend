export type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  token?: string;
  getAccessToken?: () => Promise<string | null>;
};
