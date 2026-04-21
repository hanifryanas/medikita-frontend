import Link from 'next/link';
import { NavAuthSection } from './components/navigation';
import { MenuIcon, PlayIcon, SearchIcon } from './icons';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.hero}>
      {/* ── Navigation ── */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href='/' className={styles.logo}>
            <span className={styles.logoMark}>✚</span>
            MediKita
          </Link>
          <ul className={styles.navLinks}>
            <li>
              <Link href='/' className={styles.navActive}>
                Home
              </Link>
            </li>
            <li>
              <Link href='/about'>About</Link>
            </li>
            <li>
              <Link href='/treatments'>Treatments</Link>
            </li>
            <li>
              <Link href='/blog'>Blog</Link>
            </li>
            <li>
              <Link href='/contact'>Contact</Link>
            </li>
          </ul>
          <div className={styles.navIcons}>
            <button className={styles.iconBtn} aria-label='Search'>
              <SearchIcon />
            </button>
            <button className={styles.iconBtn} aria-label='Menu'>
              <MenuIcon />
            </button>
            <NavAuthSection />
          </div>
        </div>
      </nav>

      {/* ── Hero content ── */}
      <div className={styles.heroBody}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>MediKita</p>
          <h1 className={styles.heroTitle}>
            Compassionate care,
            <br />
            exceptional results.
          </h1>
          <p className={styles.heroDesc}>
            Our team of experienced doctors and healthcare professionals are committed to providing
            high-quality, personalized attention to our patients.
          </p>
          <button className={styles.ctaBtn}>
            <span className={styles.ctaIcon}>
              <PlayIcon />
            </span>
            See how we work
          </button>
        </div>
      </div>

      {/* ── Floating patient card ── */}
      <div className={styles.patientCard}>
        <div className={styles.avatarGroup}>
          <span className={`${styles.avatar} ${styles.avatarA}`} />
          <span className={`${styles.avatar} ${styles.avatarB}`} />
          <span className={`${styles.avatar} ${styles.avatarC}`} />
        </div>
        <div className={styles.cardInfo}>
          <strong className={styles.cardNum}>150K+</strong>
          <span className={styles.cardLabel}>Patients Worldwide</span>
        </div>
        <span className={styles.checkBadge}>✓</span>
      </div>

      {/* ── Stats bar ── */}
      <div className={styles.statsBar}>
        {STATS.map((s) => (
          <div key={s.num} className={styles.statItem}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

const STATS = [
  { num: '20+', label: 'Years in experience' },
  { num: '95%', label: 'Patient satisfaction' },
  { num: '5,000+', label: 'Patients served' },
  { num: '10+', label: 'Specializations' },
];
