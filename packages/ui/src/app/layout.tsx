import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';

import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'TORQ - Strava Activity Image Generator',
  description:
    'Generate stunning AI-powered images for your Strava activities. Transform your workout data into beautiful visual stories.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'),
  openGraph: {
    title: 'TORQ - Strava Activity Image Generator',
    description:
      'Generate stunning AI-powered images for your Strava activities. Transform your workout data into beautiful visual stories.',
    url: '/',
    siteName: 'TORQ',
    images: [
      {
        url: '/banner.webp',
        width: 1200,
        height: 630,
        alt: 'TORQ - Strava Activity Image Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TORQ - Strava Activity Image Generator',
    description:
      'Generate stunning AI-powered images for your Strava activities. Transform your workout data into beautiful visual stories.',
    images: ['/banner.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * Root HTML layout. Server component — wraps the app with the layout shell
 * (Header, Footer) and the client-side ThemeProvider. The `suppressHydrationWarning`
 * attribute on `<html>` is required by next-themes to prevent hydration mismatch
 * when applying the theme class. The same attribute on `<body>` prevents hydration
 * warnings from browser extensions (e.g., Grammarly) that inject attributes.
 * @param {RootLayoutProps} props - Layout props.
 * @param {React.ReactNode} props.children - Page content.
 * @returns {JSX.Element} Root layout.
 */
const Layout = ({ children }: RootLayoutProps): JSX.Element => (
  <html lang="en" suppressHydrationWarning className={inter.variable}>
    <body className="font-sans" suppressHydrationWarning>
      <NextTopLoader showSpinner={false} />
      <Providers>
        <div className="flex flex-col items-center justify-between gap-8 min-h-screen w-full max-w-[1000px] mx-auto px-4 box-border">
          <Header />
          <main
            aria-live="polite"
            role="main"
            className="w-full min-h-[calc(100vh-170px)] mt-[70px] mb-[70px]"
          >
            {children}
          </main>
          <Footer />
        </div>
      </Providers>
    </body>
  </html>
);

export default Layout;
