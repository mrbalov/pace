import { Button } from '@geist-ui/core';
import { Sun, Moon } from '@geist-ui/icons';
import { useTheme } from '@geist-ui/core';
import { useCallback } from 'react';

interface ThemeSwitcherProps {
  className?: string;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

/**
 * Theme switcher button component.
 * @param {ThemeSwitcherProps} root0 - Component props
 * @param {string} root0.className - Optional CSS class name
 * @param {Function} root0.onThemeChange - Callback to change theme
 * @returns {JSX.Element} Theme switcher button
 */
export default function ThemeSwitcher({ className, onThemeChange }: ThemeSwitcherProps) {
  const theme = useTheme();

  /**
   * Toggles between light and dark theme.
   * @returns {void}
   */
  const toggleTheme = useCallback(() => {
    const newTheme = theme.type === 'dark' ? 'light' : 'dark';
    onThemeChange(newTheme);
  }, [theme.type, onThemeChange]);

  return (
    <Button
      auto
      type="default"
      scale={0.6}
      icon={theme.type === 'dark' ? <Sun /> : <Moon />}
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${theme.type === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme.type === 'dark' ? 'light' : 'dark'} mode`}
      placeholder="Toggle Theme"
      onPointerEnterCapture={() => undefined}
      onPointerLeaveCapture={() => undefined}
    />
  );
}
