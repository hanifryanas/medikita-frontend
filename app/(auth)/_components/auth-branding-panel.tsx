import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './auth-branding-panel.module.scss';

interface AuthBrandingPanelProps {
  badgeText: string;
  tagline: ReactNode;
  sub: string;
}

export const AuthBrandingPanel = ({ badgeText, tagline, sub }: AuthBrandingPanelProps) => (
  <aside className={styles.panel}>
    <Link href='/' className={styles.panelLogo}>
      <span className={styles.logoMark}>✚</span>
      MediKita
    </Link>

    <div className={styles.panelBody}>
      <div className={styles.panelBadge}>
        <span>✚</span>
        {badgeText}
      </div>
      <h2 className={styles.panelTagline}>{tagline}</h2>
      <p className={styles.panelSub}>{sub}</p>
    </div>
  </aside>
);
