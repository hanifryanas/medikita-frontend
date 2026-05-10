import styles from './spinner.module.scss';

interface SpinnerProps {
  /** Pixel size of the spinner. Defaults to 16. */
  size?: number;
  /** Border thickness in px. Defaults to 2. */
  thickness?: number;
  /** Optional additional class name. */
  className?: string;
}

/**
 * Inline circular spinner. Inherits color from `currentColor`,
 * so it works inside buttons, links, or any text context.
 */
export const Spinner = ({ size = 16, thickness = 2, className }: SpinnerProps) => {
  return (
    <span
      className={`${styles.spinner} ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
      }}
      role='status'
      aria-label='Loading'
    />
  );
};
