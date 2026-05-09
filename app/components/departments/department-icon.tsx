'use client';

import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

export interface DepartmentIconProps {
  /** Lucide icon name in kebab-case (matches `Department.iconName`). */
  name?: string | null;
  /** Fallback icon name when `name` is missing or invalid. */
  fallback?: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  'aria-label'?: string;
}

/**
 * Renders a Lucide icon by name. Lazy-loads only the requested icon, so the
 * full Lucide bundle is never shipped to the client.
 */
export const DepartmentIcon = ({
  name,
  fallback = 'stethoscope',
  size = 24,
  strokeWidth = 1.75,
  className,
  'aria-label': ariaLabel,
}: DepartmentIconProps) => {
  const resolved = (name ?? fallback) as IconName;

  return (
    <DynamicIcon
      name={resolved}
      fallback={() => <DynamicIcon name={fallback} size={size} strokeWidth={strokeWidth} />}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
};
