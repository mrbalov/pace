'use client';

import { ThemeProvider } from 'next-themes';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Thin client boundary providing SSR-safe theme context via next-themes.
 * @param {ProvidersProps} props - Component props.
 * @param {React.ReactNode} props.children - Page content.
 * @returns {JSX.Element} Theme provider wrapper.
 */
const Providers = ({ children }: ProvidersProps): JSX.Element => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    {children}
  </ThemeProvider>
);

export default Providers;
