import { Button } from '@geist-ui/core';
import { Sun, Moon } from '@geist-ui/icons';
import { useTheme } from '@geist-ui/core';

interface ThemeSwitcherProps {
  className?: string;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export default function ThemeSwitcher({ className, onThemeChange }: ThemeSwitcherProps) {
  const theme = useTheme();

  const toggleTheme = () => {
    const newTheme = theme.type === 'dark' ? 'light' : 'dark';
    onThemeChange(newTheme);
  };

  return (
    <Button
      auto
      icon={theme.type === 'dark' ? <Sun /> : <Moon />}
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${theme.type === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme.type === 'dark' ? 'light' : 'dark'} mode`}
    />
  );
}
