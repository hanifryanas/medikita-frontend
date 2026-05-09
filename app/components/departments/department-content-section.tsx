'use client';

import type { DepartmentContent } from '@/lib/types/departments';
import { CheckCircle2 } from 'lucide-react';
import styles from './department-content-section.module.scss';

interface DepartmentContentSectionProps {
  content?: DepartmentContent;
  fallbackTitle?: string;
}

export const DepartmentContentSection = ({
  content,
  fallbackTitle = 'About this department',
}: DepartmentContentSectionProps) => {
  const tagline = content?.tagline;
  const overview = content?.overview;
  const highlights = content?.highlights ?? [];
  const faq = content?.faq ?? [];

  if (!tagline && !overview && highlights.length === 0 && faq.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby='department-content-title'>
      <h2 id='department-content-title' className={styles.title}>
        {tagline ?? fallbackTitle}
      </h2>

      {overview && <p className={styles.overview}>{overview}</p>}

      {highlights.length > 0 && (
        <>
          <h3 className={styles.subtitle}>Highlights</h3>
          <ul className={styles.highlightList}>
            {highlights.map((item) => (
              <li key={item} className={styles.highlightItem}>
                <CheckCircle2 className={styles.highlightIcon} size={18} aria-hidden='true' />
                <span className={styles.highlightText}>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {faq.length > 0 && (
        <>
          <h3 className={styles.subtitle}>Frequently asked</h3>
          <ul className={styles.faqList}>
            {faq.map((item) => (
              <li key={item.question} className={styles.faqItem}>
                <span className={styles.faqQuestion}>{item.question}</span>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};
