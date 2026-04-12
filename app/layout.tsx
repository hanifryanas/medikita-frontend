import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.scss';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title:
    'MediKita - Trusted Healthcare Partner for Personalized Care and Compassionate Service',
  description:
    'MediKita is here to provide you with the best healthcare experience. Our team of experienced doctors and healthcare professionals are committed to providing high-quality, personalized attention to our patients. Whether you need a routine check-up or specialized care, we are here to support you every step of the way.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
