import Link from "next/dist/client/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.hero}>
      {/* ── Navigation ── */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark}>✚</span>
            MediKita
          </Link>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/" className={styles.navActive}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/treatments">Treatments</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
          <div className={styles.navIcons}>
            <button className={styles.iconBtn} aria-label="Search">
              <SearchIcon />
            </button>
            <button className={styles.iconBtn} aria-label="Menu">
              <MenuIcon />
            </button>
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
            Our team of experienced doctors and healthcare professionals are
            committed to providing high-quality, personalized attention to our
            patients.
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
  { num: "20+", label: "Years in experience" },
  { num: "95%", label: "Patient satisfaction" },
  { num: "5,000+", label: "Patients served" },
  { num: "10+", label: "Specializations" },
];

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
