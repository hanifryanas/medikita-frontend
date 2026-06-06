import { Fragment, type ReactNode } from 'react';
import styles from './summary-row.module.scss';

export interface SummaryBadge {
  label: string;
  tone?: 'neutral' | 'accent';
}

interface SummaryRowProps {
  leading: ReactNode;
  title: string;
  metaItems?: ReactNode[];
  badge?: SummaryBadge;
  onClick?: () => void;
}

export const SummaryRow = ({ leading, title, metaItems, badge, onClick }: SummaryRowProps) => {
  const isClickable = Boolean(onClick);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className={`${styles.row} ${isClickable ? styles.rowClickable : ''}`}
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {leading}
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        {metaItems && metaItems.length > 0 && (
          <div className={styles.meta}>
            {metaItems.map((item, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <span className={styles.sep} aria-hidden>
                    ·
                  </span>
                )}
                <span>{item}</span>
              </Fragment>
            ))}
          </div>
        )}
      </div>
      {badge && (
        <span className={`${styles.badge} ${badge.tone === 'accent' ? styles.badgeAccent : ''}`}>
          {badge.label}
        </span>
      )}
    </article>
  );
};
