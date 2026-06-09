'use client';

import { SubmitButton } from '@/app/components/common';
import { DatePicker } from '@/app/components/common/pickers';
import { ImageUploader } from '@/app/components/images';
import { nextApi } from '@/lib/api/next';
import type { SignupFormPayload, SignupPayload } from '@/lib/types/auth';
import { UserGenderType } from '@/lib/types/users';
import { isValidationResultValid, type FormValidationResult } from '@/lib/types/validations';
import { isSafeRedirectPath } from '@/lib/utils/checkers';
import { digitStringFormatter } from '@/lib/utils/formatters';
import { validateSignupForm } from '@/lib/validations/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { AuthBrandingPanel, AuthMobileLogo, PasswordInput } from '../_components';
import styles from '../auth.module.scss';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const safeNext = isSafeRedirectPath(nextParam) ? nextParam : null;
  const signinHref = safeNext ? `/signin?next=${encodeURIComponent(safeNext)}` : '/signin';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState<SignupFormPayload>({
    identityNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    gender: UserGenderType.Female,
    dateOfBirth: '2000-01-01',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState<FormValidationResult<SignupFormPayload>['errors']>({});

  const setField = (
    key: keyof SignupFormPayload,
    value: SignupFormPayload[keyof SignupFormPayload]
  ) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoUpload = (url: string) => {
    setField('photoUrl', url);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (isSubmitting) return;
    const result = validateSignupForm(fields);

    const errors: FormValidationResult<SignupFormPayload>['errors'] = { ...result.errors };
    if (!fields.terms) {
      errors.terms = 'You must accept the terms to continue.';
    }
    if (!isValidationResultValid({ errors: errors })) {
      setErrors(errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const payload: SignupPayload = {
        identityNumber: fields.identityNumber,
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        userName: fields.userName,
        gender: fields.gender,
        dateOfBirth: fields.dateOfBirth,
        phoneNumber: fields.phoneNumber,
        address: fields.address,
        password: fields.password,
        ...(fields.photoUrl && { photoUrl: fields.photoUrl }),
      };
      await nextApi.auth.signup(payload);
      router.push(signinHref);
    } catch (err) {
      setErrors({
        email: err instanceof Error ? err.message : 'Sign up failed.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <AuthBrandingPanel
        badgeText='Join 150K+ patients worldwide'
        tagline={
          <>
            Compassionate care,
            <br />
            exceptional results.
          </>
        }
        sub='Create your free account and get access to expert consultations, appointment scheduling, and your complete health history — all in one secure place.'
      />

      {/* ── Right form side ── */}
      <section className={`${styles.formSide} ${styles.formSideCompact}`}>
        <AuthMobileLogo />

        <div className={`${styles.formCard} ${styles.formCardWide}`}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Create an account</h1>
            <p className={styles.formSubtitle}>Start your health journey with MediKita today</p>
          </div>

          <form className={`${styles.form} ${styles.formGrid}`} onSubmit={handleSubmit} noValidate>
            {/* Identity number */}
            <div className={styles.field}>
              <label htmlFor='identityNumber' className={styles.label}>
                Identity number
              </label>
              <input
                id='identityNumber'
                type='text'
                inputMode='numeric'
                maxLength={20}
                placeholder='5908370143133247'
                value={fields.identityNumber}
                onChange={(e) => setField('identityNumber', digitStringFormatter(e.target.value))}
                className={`${styles.input} ${errors.identityNumber ? styles.inputError : ''}`}
              />
              {errors.identityNumber && (
                <span className={styles.errorMsg}>{errors.identityNumber}</span>
              )}
            </div>

            {/* Phone */}
            <div className={styles.field}>
              <label htmlFor='phoneNumber' className={styles.label}>
                Phone number
              </label>
              <input
                id='phoneNumber'
                type='tel'
                inputMode='numeric'
                autoComplete='tel'
                maxLength={15}
                placeholder='629575997989'
                value={fields.phoneNumber}
                onChange={(e) => setField('phoneNumber', digitStringFormatter(e.target.value))}
                className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
              />
              {errors.phoneNumber && <span className={styles.errorMsg}>{errors.phoneNumber}</span>}
            </div>

            {/* Email */}
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label htmlFor='email' className={styles.label}>
                Email address
              </label>
              <input
                id='email'
                type='email'
                autoComplete='email'
                placeholder='you@example.com'
                value={fields.email}
                onChange={(e) => setField('email', e.target.value)}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>

            {/* First + Last name */}
            <div className={styles.field}>
              <label htmlFor='firstName' className={styles.label}>
                First name
              </label>
              <input
                id='firstName'
                type='text'
                autoComplete='given-name'
                maxLength={25}
                placeholder='Rania'
                value={fields.firstName}
                onChange={(e) => setField('firstName', e.target.value)}
                className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
              />
              {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor='lastName' className={styles.label}>
                Last name
              </label>
              <input
                id='lastName'
                type='text'
                autoComplete='family-name'
                maxLength={25}
                placeholder='Isya'
                value={fields.lastName}
                onChange={(e) => setField('lastName', e.target.value)}
                className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
              />
              {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
            </div>

            {/* Username */}
            <div className={styles.field}>
              <label htmlFor='userName' className={styles.label}>
                Username
              </label>
              <input
                id='userName'
                type='text'
                autoComplete='username'
                maxLength={25}
                placeholder='raniaisya'
                value={fields.userName}
                onChange={(e) => setField('userName', e.target.value.toLowerCase())}
                className={`${styles.input} ${errors.userName ? styles.inputError : ''}`}
              />
              {errors.userName && <span className={styles.errorMsg}>{errors.userName}</span>}
            </div>

            {/* Profile photo */}
            <div className={styles.field}>
              <label className={styles.label}>Profile photo (optional)</label>
              <div className={styles.photoUpload}>
                {fields.photoUrl ? (
                  <Image
                    src={fields.photoUrl}
                    width={64}
                    height={64}
                    alt='Profile preview'
                    className={styles.photoPreview}
                  />
                ) : (
                  <div className={styles.photoPlaceholder}>No photo</div>
                )}
                <ImageUploader folder='profiles' onUpload={handlePhotoUpload}>
                  {({ open, isLoading }) => (
                    <button
                      type='button'
                      className={styles.photoBtn}
                      onClick={open}
                      disabled={isLoading}
                    >
                      {fields.photoUrl ? 'Change' : 'Upload'}
                    </button>
                  )}
                </ImageUploader>
              </div>
            </div>

            {/* Gender + birth date */}
            <div className={styles.field}>
              <label htmlFor='gender' className={styles.label}>
                Gender
              </label>
              <select
                id='gender'
                value={fields.gender}
                onChange={(e) => setField('gender', e.target.value as SignupFormPayload['gender'])}
                className={`${styles.input} ${errors.gender ? styles.inputError : ''}`}
              >
                <option value='female'>Female</option>
                <option value='male'>Male</option>
              </select>
              {errors.gender && <span className={styles.errorMsg}>{errors.gender}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor='dateOfBirth' className={styles.label}>
                Date of birth
              </label>
              <DatePicker
                id='dateOfBirth'
                value={fields.dateOfBirth}
                onChange={(value) => setField('dateOfBirth', value)}
                hasError={Boolean(errors.dateOfBirth)}
              />
              {errors.dateOfBirth && <span className={styles.errorMsg}>{errors.dateOfBirth}</span>}
            </div>

            {/* Address */}
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label htmlFor='address' className={styles.label}>
                Address
              </label>
              <textarea
                id='address'
                placeholder='Jl Ki Ageng Pemanahan No. L-268, Kel. Kanigoro, Kec. Kartoharjo, Kota Madiun, Jawa Timur'
                value={fields.address}
                onChange={(e) => setField('address', e.target.value)}
                className={`${styles.textarea} ${errors.address ? styles.inputError : ''}`}
                rows={2}
              />
              {errors.address && <span className={styles.errorMsg}>{errors.address}</span>}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor='password' className={styles.label}>
                Password
              </label>
              <PasswordInput
                id='password'
                autoComplete='new-password'
                placeholder='Min. 8 characters'
                value={fields.password}
                onChange={(e) => setField('password', e.target.value)}
                inputClassName={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              />
              {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
            </div>

            {/* Confirm password */}
            <div className={styles.field}>
              <label htmlFor='confirmPassword' className={styles.label}>
                Confirm password
              </label>
              <PasswordInput
                id='confirmPassword'
                autoComplete='new-password'
                placeholder='Repeat password'
                value={fields.confirmPassword}
                onChange={(e) => setField('confirmPassword', e.target.value)}
                inputClassName={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                toggleLabel='confirm password'
              />
              {errors.confirmPassword && (
                <span className={styles.errorMsg}>{errors.confirmPassword}</span>
              )}
            </div>

            {/* Terms */}
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.checkLabel}>
                <input
                  type='checkbox'
                  checked={fields.terms}
                  onChange={(e) => setField('terms', e.target.checked)}
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
              {errors.terms && <span className={styles.errorMsg}>{errors.terms}</span>}
            </div>

            <SubmitButton
              className={styles.fieldFull}
              isLoading={isSubmitting}
              loadingLabel='Creating account…'
            >
              Create account
            </SubmitButton>
            <p className={`${styles.footerText} ${styles.fieldFull}`}>
              Already have an account? <Link href={signinHref}>Sign in</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
