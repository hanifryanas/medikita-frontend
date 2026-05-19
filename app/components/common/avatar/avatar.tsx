'use client';

import { getUserInitial } from '@/lib/utils/formatters';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import styles from './avatar.module.scss';

type UserInitialInput = Parameters<typeof getUserInitial>[0];

export interface AvatarProps {
  photoUrl?: string | null;
  name: UserInitialInput;
  size?: number;
  alt?: string;
  className?: string;
  imageClassName?: string;
  initialClassName?: string;
  style?: CSSProperties;
}

export const Avatar = ({
  photoUrl,
  name,
  size = 40,
  alt = '',
  className,
  imageClassName,
  initialClassName,
  style,
}: AvatarProps) => {
  const rootClass = [styles.root, className].filter(Boolean).join(' ');
  const imgClass = [styles.image, imageClassName].filter(Boolean).join(' ');
  const initialClass = [styles.initial, initialClassName].filter(Boolean).join(' ');

  return (
    <span
      className={rootClass}
      style={{ width: size, height: size, ...style }}
      aria-hidden={alt ? undefined : true}
    >
      {photoUrl ? (
        <Image src={photoUrl} alt={alt} className={imgClass} width={size} height={size} />
      ) : (
        <span className={initialClass}>{getUserInitial(name)}</span>
      )}
    </span>
  );
};
