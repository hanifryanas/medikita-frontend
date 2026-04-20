'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { nextApi } from '@/lib/api/next';
import { useAuthStore } from '@/lib/stores';
import styles from '../auth.module.scss';
import { GoogleIcon } from '@/app/icons';

interface FormFields {
  identifier: string;
  password: string;
  remember: boolean;
}

type LoginErrors = Partial<Record<'identifier' | 'password', string>>;

export default function LoginPage() {
  const router = useRouter();
  const validateLoginPayload = useAuthStore((s) => s.validateLoginPayload);
  const login = useAuthStore((s) => s.login);
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

    const payload = {
      identifier: fields.identifier,
      password: fields.password,
      isRemember: fields.remember,
    };

    const validation = validateLoginPayload(payload);

    if (Object.keys(validation.errors).length) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    try {
      const data = await nextApi.auth.login(payload);
      login(data.user, data.accessToken);
      router.push('/');
    } catch (err) {
      setErrors({ identifier: err instanceof Error ? err.message : 'Login failed.' });
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
