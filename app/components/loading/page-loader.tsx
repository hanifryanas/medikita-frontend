import styles from './page-loader.module.scss';

interface PageLoaderProps {
  isWithLogo?: boolean;
  label?: string;
}

export const PageLoader = ({ isWithLogo = true, label }: PageLoaderProps) => {
  return (
    <div className={styles.wrapper} role='status' aria-live='polite'>
      {isWithLogo && (
        <span className={styles.brand}>
          <span className={styles.mark}>✚</span>
          MediKita
        </span>
      )}
      <span className={styles.spinner} aria-hidden='true' />
      <span className={styles.label}>{label}</span>
    </div>
  );
};
