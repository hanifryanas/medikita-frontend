import { PublicNav } from '@/app/components/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.scss';

export const metadata = {
  title: 'About — MediKita',
  description:
    'About MediKita: a portfolio project by Hanif Ryan demonstrating a production-grade, high-scale healthcare frontend.',
};

interface Highlight {
  tag: string;
  title: string;
  body: string;
}

const HIGHLIGHTS: Highlight[] = [
  {
    tag: 'Architecture',
    title: 'BFF + App Router',
    body: 'Next.js App Router with a dedicated `/api/*` BFF layer. Server components hit the upstream API directly; browser clients go through cookie-aware proxy routes.',
  },
  {
    tag: 'Data',
    title: 'Modeled for scale',
    body: 'Access patterns favor partition-friendly reads and hierarchical keys — designed to drop onto Azure Cosmos DB or any horizontally scaled store without rewrites.',
  },
  {
    tag: 'State',
    title: 'Predictable client state',
    body: 'Zustand stores grouped by domain (auth, patients, appointments, care-teams) keep client state small, typed, and easy to hydrate from server props.',
  },
  {
    tag: 'Caching',
    title: 'Tagged & revalidated',
    body: '`use cache` with `cacheTag` / `cacheLife` for landing data; on-demand revalidation on writes so dashboards stay live without thrashing the origin.',
  },
  {
    tag: 'UX',
    title: 'Theme-aware design system',
    body: 'CSS custom properties driven by a `[data-theme]` runtime switch. SCSS modules per route keep styles colocated and tree-shakable.',
  },
  {
    tag: 'DX',
    title: 'Typed end-to-end',
    body: 'Strict TypeScript across `lib/types/*`, named date-fns formatters, and lint rules wired into the editor — refactors propagate safely.',
  },
];

const STACK = [
  'Next.js 16',
  'React 19',
  'TypeScript',
  'App Router',
  'Zustand',
  'SCSS Modules',
  'date-fns',
  'NestJS API',
  'TypeORM',
  'PostgreSQL',
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>About this project</p>
            <h1 className={styles.title}>
              Hi, I&apos;m Hanif —
              <br />
              this is MediKita.
            </h1>
            <p className={styles.lede}>
              I&apos;m a full-stack engineer focused on healthcare and high-traffic web platforms.
              MediKita is my portfolio playground: a clinic operations app where I get to design,
              ship, and stress-test the patterns I&apos;d reach for in a real production system.
            </p>
            <div className={styles.heroActions}>
              <Link
                href='https://github.com/hanifryanas/medikita-frontend'
                target='_blank'
                rel='noopener noreferrer'
                className={`${styles.linkBtn} ${styles.linkBtnPrimary}`}
              >
                View on GitHub
              </Link>
              <Link
                href='https://github.com/hanifryanas'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.linkBtn}
              >
                More of my work
              </Link>
            </div>
          </div>
          <Link
            href='https://github.com/hanifryanas'
            target='_blank'
            rel='noopener noreferrer'
            className={styles.heroAvatar}
            aria-label='Hanif Ryan on GitHub'
          >
            <Image
              src='https://github.com/hanifryanas.png'
              alt='Hanif Ryan'
              fill
              sizes='(max-width: 768px) 120px, 168px'
              priority
            />
          </Link>
        </section>

        <aside className={styles.disclaimer} aria-label='Disclaimer'>
          <span className={styles.disclaimerBadge} aria-hidden>
            i
          </span>
          <div className={styles.disclaimerBody}>
            <strong>This is a dummy portfolio project.</strong>
            <p>
              MediKita is not a real clinic. All doctors, patients, departments, and appointments
              are fabricated demo data. The product is intentionally over-engineered so the
              architecture can hold up under realistic, high-scale healthcare workloads.
            </p>
          </div>
        </aside>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Built for scale, on purpose</h2>
          <p className={styles.sectionLede}>
            Every layer was chosen with multi-tenant clinic operations in mind — many concurrent
            users, low-latency reads, and write patterns that don&apos;t collapse under load.
          </p>
          <div className={styles.grid}>
            {HIGHLIGHTS.map((h) => (
              <article key={h.title} className={styles.card}>
                <span className={styles.cardTag}>{h.tag}</span>
                <h3 className={styles.cardTitle}>{h.title}</h3>
                <p className={styles.cardBody}>{h.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Stack</h2>
          <p className={styles.sectionLede}>
            Modern, boring-on-purpose choices — the kind a team can onboard onto on day one.
          </p>
          <div className={styles.chips}>
            {STACK.map((s) => (
              <span key={s} className={styles.chip}>
                {s}
              </span>
            ))}
          </div>
        </section>

        <p className={styles.footnote}>
          No real patient data is collected or stored. Auth flows, records, and uploads are wired
          end-to-end for demonstration only.
        </p>
      </main>
    </div>
  );
}
