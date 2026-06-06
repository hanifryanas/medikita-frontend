import { CalendarPlus, Stethoscope, UserPlus } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './quick-actions.module.scss';

interface QuickAction {
  href: string;
  label: string;
  hint: string;
  icon: ReactNode;
}

const ACTIONS: QuickAction[] = [
  {
    href: '/care-teams',
    label: 'Book appointment',
    hint: 'Find a care team and pick a time',
    icon: <CalendarPlus size={18} aria-hidden />,
  },
  {
    href: '/patients',
    label: 'Add a patient',
    hint: 'Link a family member to your account',
    icon: <UserPlus size={18} aria-hidden />,
  },
  {
    href: '/specialties',
    label: 'Browse specialties',
    hint: 'Explore departments and services',
    icon: <Stethoscope size={18} aria-hidden />,
  },
];

export const QuickActions = () => (
  <div className={styles.grid}>
    {ACTIONS.map((a) => (
      <Link key={a.href} href={a.href} className={styles.action}>
        <span className={styles.iconWrap}>{a.icon}</span>
        <span className={styles.text}>
          <span className={styles.label}>{a.label}</span>
          <span className={styles.hint}>{a.hint}</span>
        </span>
      </Link>
    ))}
  </div>
);
