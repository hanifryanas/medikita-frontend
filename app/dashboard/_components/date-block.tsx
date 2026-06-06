import { formatDate } from '@/lib/utils/formatters';
import styles from './date-block.module.scss';

interface DateBlockProps {
  date: Date;
}

export const DateBlock = ({ date }: DateBlockProps) => (
  <div className={styles.block} aria-label={formatDate(date, 'EEEE, d MMMM yyyy')}>
    <span className={styles.weekday} aria-hidden>
      {formatDate(date, 'EEE')}
    </span>
    <span className={styles.day} aria-hidden>
      {formatDate(date, 'd')}
    </span>
    <span className={styles.month} aria-hidden>
      {formatDate(date, 'MMM')}
    </span>
  </div>
);
