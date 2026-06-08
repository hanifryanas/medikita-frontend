'use client';

import { SubmitButton } from '@/app/components/common';
import { nextApi } from '@/lib/api/next';
import { useStores } from '@/lib/stores';
import type { SigninPayload } from '@/lib/types/auth';
import { AuthStatus } from '@/lib/types/auth';
import { isValidationResultValid, type FormValidationResult } from '@/lib/types/validations';
import { isSafeRedirectPath } from '@/lib/utils/checkers';
import { validateSignin } from '@/lib/validations/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AuthBrandingPanel, AuthMobileLogo } from '../_components';
import styles from '../auth.module.scss';

export default function SigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const safeNext = isSafeRedirectPath(nextParam) ? nextParam : null;
  const redirectTarget = safeNext ?? '/';
  const {
    authStore: { signin, status },
  } = useStores();

  useEffect(() => {
    if (status === AuthStatus.Authenticated) {
      router.replace(redirectTarget);
    }
  }, [status, redirectTarget, router]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState<SigninPayload>({
    identifier: '',
    password: '',
    isRemember: false,
  });
  const [errors, setErrors] = useState<FormValidationResult<SigninPayload>['errors']>({});

  const setField = (key: keyof SigninPayload, value: SigninPayload[keyof SigninPayload]) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validation = validateSignin(fields);

    if (!isValidationResultValid(validation)) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const data = await nextApi.auth.signin(fields);
      signin(data.user, data.accessToken);
      router.replace(redirectTarget);
    } catch (err) {
      setErrors({ identifier: err instanceof Error ? err.message : 'Sign in failed.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <AuthBrandingPanel
        badgeText='Trusted by 150K+ patients worldwide'
        tagline={
          <>
            Your health,
            <br />
            our priority.
          </>
        }
        sub='Sign in to manage your appointments, access medical records, and connect with our team of specialists — all in one place.'
      />

      {/* ── Right form side ── */}
      <section className={styles.formSide}>
        <AuthMobileLogo />

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
                onChange={(e) => setField('identifier', e.target.value)}
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
                  onChange={(e) => setField('password', e.target.value)}
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
                  onChange={(e) => setField('isRemember', e.target.checked)}
                />
                Remember me
              </label>
              <Link href='/forgot-password' className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <SubmitButton isLoading={isSubmitting} loadingLabel='Signing in…'>
              Sign in
            </SubmitButton>
            <p className={styles.footerText}>
              Don&apos;t have an account?{' '}
              <Link href={safeNext ? `/signup?next=${encodeURIComponent(safeNext)}` : '/signup'}>
                Create one free
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
