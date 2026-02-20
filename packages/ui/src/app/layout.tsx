import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';

import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'TORQ - Strava Activity Image Generator',
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
 * when applying the theme class.
 *
 * @param {RootLayoutProps} props - Layout props.
 * @param {React.ReactNode} props.children - Page content.
 * @returns {JSX.Element} Root layout.
 */
const Layout = ({ children }: RootLayoutProps): JSX.Element => (
  <html lang="en" suppressHydrationWarning className={inter.variable}>
    <body className="font-sans">
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
