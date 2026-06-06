import { ThemeProvider } from '@/lib/theme';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ConfirmDialogHost, ToastViewport } from './components/common';
import { Hydrator } from './components/hydrators';
import { PageLoader } from './components/loading';
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
  title: {
    default: 'MediKita — Better care, fewer clipboards',
    template: '%s · MediKita',
  },
  description:
    'Book doctors, share records, and coordinate care in one platform built for Indonesian patients and clinics.',
  applicationName: 'MediKita',
  keywords: ['healthcare', 'doctor booking', 'clinic management', 'medical records', 'Indonesia'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <div id='__initial_splash' aria-hidden='true'>
          <PageLoader />
        </div>
        <ThemeProvider>
          <Hydrator />
          {children}
          <ConfirmDialogHost />
          <ToastViewport />
        </ThemeProvider>
      </body>
    </html>
  );
}
