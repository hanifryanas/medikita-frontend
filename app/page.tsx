import { nestApi } from '@/lib/api';
import { HomeStatsResult } from '@/lib/types/home';
import { hoursToSeconds } from 'date-fns';
import Link from 'next/link';
import { PublicNav } from './components/navigation';
import { SearchIcon } from './icons';
import styles from './page.module.scss';

export const revalidate = hoursToSeconds(4);

const VIDEO_INTRO_URL =
  'https://res.cloudinary.com/dgkjmnir8/video/upload/v1780371070/mixkit-doctor-writing-prescription-17540-hd-ready_el5wh3.mp4';

interface Stat {
  num: string;
  label: string;
}

async function getLandingStats(): Promise<Stat[]> {
  const stats: Stat[] = [];

  try {
    const homeStats = await nestApi.get<HomeStatsResult>('home/stats');
    stats.push({ num: String(homeStats.doctorCount), label: 'Trusted doctors' });
    stats.push({ num: String(homeStats.clinicDepartmentCount), label: 'Specialties covered' });
  } catch (err) {
    console.error('Failed to load landing page stats:', err);
  }

  stats.push({ num: '< 2 min', label: 'To book a visit' });
  stats.push({ num: '24/7', label: 'Care access' });
  return stats;
}

export default async function Home() {
  const stats = await getLandingStats();

  return (
    <main className={styles.hero}>
      <video
        className={styles.heroVideo}
        src={VIDEO_INTRO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload='metadata'
        aria-hidden
      />
      <div className={styles.heroOverlay} aria-hidden />
      <PublicNav />
      <div className={styles.heroBody}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>MediKita</p>
          <h1 className={styles.heroTitle}>
            Better care,
            <br />
            fewer clipboards.
          </h1>
          <p className={styles.heroDesc}>
            One platform for patients and clinics. Book visits, share records, and coordinate care —
            without the paperwork.
          </p>
          <Link href='/care-teams' className={styles.ctaBtn}>
            <span className={styles.ctaIcon}>
              <SearchIcon />
            </span>
            Find a doctor
          </Link>
        </div>
      </div>
      <div className={styles.trustCard} role='note' aria-label='Compliance and security'>
        <span className={styles.trustInfo}>
          <span className={styles.trustLabel}>Built for healthcare</span>
          <strong className={styles.trustTitle}>RS-compliant · ISO 27001</strong>
        </span>
        <span className={styles.trustBadge} aria-hidden>
          ✓
        </span>
      </div>
      <div className={styles.statsBar}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
