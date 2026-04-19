export const appConfig = {
  nodeEnv: process.env.NODE_ENV,
  nextApiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
  nestApiBaseUrl: process.env.NEST_API_URL,
} as const;
