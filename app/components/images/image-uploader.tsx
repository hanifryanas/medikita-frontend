'use client';

import { appConfig } from '@/lib/config/app-config';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';

interface ImageUploaderProps {
  folder?: string;
  onUpload: (imageUrl: string) => void;
  children: (helpers: { open: () => void; isLoading: boolean }) => React.ReactNode;
}

export const ImageUploader = ({ folder, onUpload, children }: ImageUploaderProps) => {
  const handleSuccess = (results: CloudinaryUploadWidgetResults) => {
    const info = results.info;
    if (typeof info === 'object' && info !== null) {
      onUpload(info.secure_url);
    }
  };

  return (
    <CldUploadWidget
      uploadPreset={appConfig.cloudinary.uploadPreset}
      signatureEndpoint='/api/cloudinary/sign'
      options={{
        folder: folder ?? 'images',
        maxFiles: 1,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxFileSize: 5_000_000,
      }}
      onSuccess={handleSuccess}
    >
      {({ open, isLoading }) => children({ open, isLoading: isLoading ?? false })}
    </CldUploadWidget>
  );
};
