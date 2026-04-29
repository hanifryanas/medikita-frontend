'use client';

import { CldImage, type CldImageProps } from 'next-cloudinary';

type DisplayImageProps = Omit<CldImageProps, 'config'>;

export const DisplayImage = ({
  deliveryType = 'fetch',
  crop = 'fill',
  gravity = 'face',
  width = 64,
  height = 64,
  ...props
}: DisplayImageProps) => {
  return (
    <CldImage
      deliveryType={deliveryType}
      crop={crop}
      gravity={gravity}
      width={width}
      height={height}
      {...props}
    />
  );
};
