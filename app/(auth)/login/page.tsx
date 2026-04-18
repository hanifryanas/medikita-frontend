'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useAuthStore } from '@/lib/stores';
import { validateLogin } from '@/lib/validations';
import styles from '../auth.module.scss';

interface FormFields {
  identifier: string;
  password: string;
  remember: boolean;
}

type LoginErrors = Partial<Record<'identifier' | 'password', string>>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [fields, setFields] = useState<FormFields>({
    identifier: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState<LoginErrors>({});

  const set = (key: keyof FormFields, value: string | boolean) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateLogin({
      identifier: fields.identifier,
      password: fields.password,
      isRemember: fields.remember,
    });
    if (Object.keys(result.errors).length) {
      setErrors({
        identifier: result.errors.identifier,
        password: result.errors.password,
      });
      return;
    }

    setErrors({});
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: fields.identifier,
          password: fields.password,
          isRemember: fields.remember,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Login failed.' }));
        setErrors({ identifier: err?.message ?? 'Login failed.' });
        return;
      }

      const data: {
        accessToken: string;
        user: { id: string; email: string; username: string; phoneNumber?: string };
      } = await res.json();
      login(data.user, data.accessToken);
      router.push('/');
    } catch (err) {
      setErrors({
        identifier: err instanceof Error ? err.message : 'Login failed.',
      });
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Left branding panel ── */}
      <aside className={styles.panel}>
        <Link href='/' className={styles.panelLogo}>
          <span className={styles.logoMark}>✚</span>
          MediKita
        </Link>

        <div className={styles.panelBody}>
          <div className={styles.panelBadge}>
            <span>✚</span>
            Trusted by 150K+ patients worldwide
          </div>
          <h2 className={styles.panelTagline}>
            Your health,
            <br />
            our priority.
          </h2>
          <p className={styles.panelSub}>
            Sign in to manage your appointments, access medical records, and connect with our team
            of specialists — all in one place.
          </p>
        </div>
      </aside>

      {/* ── Right form side ── */}
      <section className={styles.formSide}>
        {/* Mobile logo */}
        <Link href='/' className={styles.mobileLogo}>
          <span className={styles.logoMark}>✚</span>
          MediKita
        </Link>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Welcome back</h1>
            <p className={styles.formSubtitle}>Sign in to your MediKita account</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* Identifier */}
            <div className={styles.field}>
              <label htmlFor='identifier' className={styles.label}>
                Email, username, or phone number
              </label>
              <input
                id='identifier'
                type='text'
                autoComplete='username'
                placeholder='you@example.com'
                value={fields.identifier}
                onChange={(e) => set('identifier', e.target.value)}
                className={`${styles.input} ${errors.identifier ? styles.inputError : ''}`}
              />
              {errors.identifier && <span className={styles.errorMsg}>{errors.identifier}</span>}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor='password' className={styles.label}>
                Password
              </label>
              <div className={styles.passwordField}>
                <input
                  id='password'
                  type={isPasswordVisible ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder='••••••••'
                  value={fields.password}
                  onChange={(e) => set('password', e.target.value)}
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                />
                <button
                  type='button'
                  className={styles.passwordToggle}
                  onClick={() => setIsPasswordVisible((value) => !value)}
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  aria-pressed={isPasswordVisible}
                >
                  {isPasswordVisible ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
            </div>

            {/* Remember me & forgot password */}
            <div className={styles.row}>
              <label className={styles.checkLabel}>
                <input
                  type='checkbox'
                  checked={fields.remember}
                  onChange={(e) => set('remember', e.target.checked)}
                />
                Remember me
              </label>
              <Link href='/forgot-password' className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button type='submit' className={styles.submitBtn}>
              Sign in
            </button>
          </form>

          <div className={styles.divider}>or continue with</div>

          <button type='button' className={styles.oauthBtn}>
            <GoogleIcon />
            Continue with Google
          </button>

          <p className={styles.footerText}>
            Don&apos;t have an account? <Link href='/signup'>Create one free</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

const GoogleIcon = () => {
  return (
    <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
      <path
        d='M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z'
        fill='#4285F4'
      />
      <path
        d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z'
        fill='#34A853'
      />
      <path
        d='M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z'
        fill='#FBBC05'
      />
      <path
        d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z'
        fill='#EA4335'
      />
    </svg>
  );
};
