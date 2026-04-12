"use client";

import Link from "next/dist/client/link";
import React, { useState } from "react";
import styles from "../auth.module.scss";

interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function SignupPage() {
  const [fields, setFields] = useState<FormFields>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function set(key: keyof FormFields, value: string | boolean) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!fields.firstName.trim()) e.firstName = "First name is required.";
    if (!fields.lastName.trim()) e.lastName = "Last name is required.";
    if (!fields.email) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      e.email = "Enter a valid email address.";
    if (!fields.password) e.password = "Password is required.";
    else if (fields.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (!fields.confirmPassword)
      e.confirmPassword = "Please confirm your password.";
    else if (fields.password !== fields.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    if (!fields.terms) e.terms = "You must accept the terms to continue.";
    return e;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    // TODO: wire up registration API
    console.log(fields);
  }

  return (
    <div className={styles.page}>
      {/* ── Left branding panel ── */}
      <aside className={styles.panel}>
        <Link href="/" className={styles.panelLogo}>
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
        <Link href="/" className={styles.mobileLogo}>
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
                <label htmlFor="firstName" className={styles.label}>
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Jane"
                  value={fields.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
                />
                {errors.firstName && (
                  <span className={styles.errorMsg}>{errors.firstName}</span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName" className={styles.label}>
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Doe"
                  value={fields.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
                />
                {errors.lastName && (
                  <span className={styles.errorMsg}>{errors.lastName}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={fields.email}
                onChange={(e) => set("email", e.target.value)}
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              />
              {errors.email && (
                <span className={styles.errorMsg}>{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={fields.password}
                onChange={(e) => set("password", e.target.value)}
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              />
              {errors.password && (
                <span className={styles.errorMsg}>{errors.password}</span>
              )}
            </div>

            {/* Confirm password */}
            <div className={styles.field}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={fields.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
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
                  type="checkbox"
                  checked={fields.terms}
                  onChange={(e) => set("terms", e.target.checked)}
                />
                I agree to the{" "}
                <Link href="/terms" style={{ color: "#3a7bd5" }}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" style={{ color: "#3a7bd5" }}>
                  Privacy Policy
                </Link>
              </label>
              {errors.terms && (
                <span className={styles.errorMsg}>{errors.terms}</span>
              )}
            </div>

            <button type="submit" className={styles.submitBtn}>
              Create account
            </button>
          </form>

          <div className={styles.divider}>or sign up with</div>

          <button type="button" className={styles.oauthBtn}>
            <GoogleIcon />
            Continue with Google
          </button>

          <p className={styles.footerText}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}
