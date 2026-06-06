'use client';

import Link from 'next/link';
import { useState } from 'react';

interface HoverPrefetchLinkProps {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const HoverPrefetchLink = ({
  href,
  className,
  onClick,
  children,
}: HoverPrefetchLinkProps) => {
  const [armed, setArmed] = useState(false);
  return (
    <Link
      href={href}
      className={className}
      prefetch={armed ? null : false}
      onMouseEnter={() => setArmed(true)}
      onFocus={() => setArmed(true)}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
