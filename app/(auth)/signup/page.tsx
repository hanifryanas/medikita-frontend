'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { authService } from '@/lib/services/auth.service';
import { useAuthStore } from '@/lib/stores';
import { validateSignup } from '@/lib/validations';
import styles from '../auth.module.scss';
import { GoogleIcon } from '@/app/icons';

interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

type SignupErrors = Partial<
  Record<
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'password'
    | 'confirmPassword'
    | 'terms',
    string
  >
>;

export default function SignupPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [fields, setFields] = useState<FormFields>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState<SignupErrors>({});

  const set = (key: keyof FormFields, value: string | boolean) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateSignup({
      firstName: fields.firstName,
      lastName: fields.lastName,
      email: fields.email,
      password: fields.password,
      confirmPassword: fields.confirmPassword,
    });
    const errs: SignupErrors = { ...result.errors };
    if (!fields.terms) {
      errs.terms = 'You must accept the terms to continue.';
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    try {
      const res = await authService.signup({
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        password: fields.password,
        confirmPassword: fields.confirmPassword,
      });

      login(res);
      router.push('/');
    } catch (err) {
      setErrors({
        email: err instanceof Error ? err.message : 'Sign up failed.',
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
            Join 150K+ patients worldwide
          </div>
          <h2 className={styles.panelTagline}>
            Compassionate care,
            <br />
            exceptional results.
          </h2>
          <p className={styles.panelSub}>
            Create your free account and get access to expert consultations,
            appointment scheduling, and your complete health history — all in
            one secure place.
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
            <h1 className={styles.formTitle}>Create an account</h1>
            <p className={styles.formSubtitle}>
              Start your health journey with MediKita today
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* First + Last name */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor='firstName' className={styles.label}>
                  First name
                </label>
                <input
                  id='firstName'
                  type='text'
                  autoComplete='given-name'
                  placeholder='Jane'
                  value={fields.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                />
                {errors.firstName && (
                  <span className={styles.errorMsg}>{errors.firstName}</span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor='lastName' className={styles.label}>
                  Last name
                </label>
                <input
                  id='lastName'
                  type='text'
                  autoComplete='family-name'
                  placeholder='Doe'
                  value={fields.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                />
                {errors.lastName && (
                  <span className={styles.errorMsg}>{errors.lastName}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label htmlFor='email' className={styles.label}>
                Email address
              </label>
              <input
                id='email'
                type='email'
                autoComplete='email'
                placeholder='you@example.com'
                value={fields.email}
                onChange={(e) => set('email', e.target.value)}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && (
                <span className={styles.errorMsg}>{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor='password' className={styles.label}>
                Password
              </label>
              <input
                id='password'
                type='password'
                autoComplete='new-password'
                placeholder='Min. 8 characters'
                value={fields.password}
                onChange={(e) => set('password', e.target.value)}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              />
              {errors.password && (
                <span className={styles.errorMsg}>{errors.password}</span>
              )}
            </div>

            {/* Confirm password */}
            <div className={styles.field}>
              <label htmlFor='confirmPassword' className={styles.label}>
                Confirm password
              </label>
              <input
                id='confirmPassword'
                type='password'
                autoComplete='new-password'
                placeholder='Repeat your password'
                value={fields.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              />
              {errors.confirmPassword && (
                <span className={styles.errorMsg}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Terms */}
            <div className={styles.field}>
              <label className={styles.checkLabel}>
                <input
                  type='checkbox'
                  checked={fields.terms}
                  onChange={(e) => set('terms', e.target.checked)}
                />
                I agree to the{' '}
                <Link href='/terms' style={{ color: '#3a7bd5' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href='/privacy' style={{ color: '#3a7bd5' }}>
                  Privacy Policy
                </Link>
              </label>
              {errors.terms && (
                <span className={styles.errorMsg}>{errors.terms}</span>
              )}
            </div>

            <button type='submit' className={styles.submitBtn}>
              Create account
            </button>
          </form>

          <div className={styles.divider}>or sign up with</div>

          <button type='button' className={styles.oauthBtn}>
            <GoogleIcon />
            Continue with Google
          </button>

          <p className={styles.footerText}>
            Already have an account? <Link href='/login'>Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
