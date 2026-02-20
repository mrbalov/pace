'use client';

import { useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

/**
 * Theme switcher button.
 * Toggles between light and dark mode using next-themes.
 * @returns {JSX.Element} Theme switcher button.
 */
const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme();

  /**
   * Toggles between light and dark theme.
   * @returns {void}
   */
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
};

export default ThemeSwitcher;
