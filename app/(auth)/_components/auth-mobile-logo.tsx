import Link from 'next/link';
import styles from './auth-mobile-logo.module.scss';

export const AuthMobileLogo = () => (
  <Link href='/' className={styles.mobileLogo}>
    <span className={styles.logoMark}>✚</span>
    MediKita
  </Link>
);
