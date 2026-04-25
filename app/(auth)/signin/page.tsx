'use client';

import { GoogleIcon } from '@/app/icons';
import { nextApi } from '@/lib/api/next';
import { useAuthStore } from '@/lib/stores';
import type { SigninPayload } from '@/lib/types/auth';
import type { FormValidationResult } from '@/lib/types/validations';
import { isValidationResultValid, validateSignin } from '@/lib/validations';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styles from '../auth.module.scss';

export default function SigninPage() {
  const router = useRouter();
  const signin = useAuthStore((s) => s.signin);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [fields, setFields] = useState<SigninPayload>({
    identifier: '',
    password: '',
    isRemember: false,
  });
  const [errors, setErrors] = useState<FormValidationResult<SigninPayload>['errors']>({});

  const set = (key: keyof SigninPayload, value: string | boolean) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateSignin(fields);

    if (!isValidationResultValid(validation)) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    try {
      const data = await nextApi.auth.signin(fields);
      signin(data.user, data.accessToken);
      router.push('/');
    } catch (err) {
      setErrors({ identifier: err instanceof Error ? err.message : 'Sign in failed.' });
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
                  checked={fields.isRemember}
                  onChange={(e) => set('isRemember', e.target.checked)}
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
