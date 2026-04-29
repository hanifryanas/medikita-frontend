export const appConfig = {
  node: {
    env: process.env.NODE_ENV,
  },
  next: {
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
    },
  },
  nest: {
    api: {
      baseUrl: process.env.NEST_API_URL,
    },
  },
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
} as const;
