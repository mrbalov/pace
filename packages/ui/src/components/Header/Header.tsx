import { useCallback } from 'react';
import { Text, Button, useTheme } from '@geist-ui/core';
import { Link } from 'wouter';
import { LogOut } from '@geist-ui/icons';

import { logout } from '../../utils/auth';
import { useAuth } from '../../hooks/useAuth';
import ThemeSwitcher from '../ThemeSwitcher';
import ActivityEmoji from '../ActivityEmoji';
import { Theme } from '../../types';

interface HeaderProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
}

interface ActionsProps {
  onThemeChange: (theme: Theme) => void;
}

/**
 * Logo component linking to home page.
 * @returns {JSX.Element} Logo component.
 */
const Logo = () => (
  <Link href="/" style={{ color: 'inherit' }}>
    <Text
      h3
      style={{
        margin: 0,
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <ActivityEmoji />
      {'\u00A0'}
      PACE
    </Text>
  </Link>
);

/**
 * Header actions including logout and theme switcher.
 * @param {ActionsProps} props - Component props.
 * @param {Function} props.onThemeChange - Callback to change theme.
 * @returns {JSX.Element} Actions component.
 */
const Actions = ({ onThemeChange }: ActionsProps) => {
  const { isAuthenticated, loading } = useAuth();

  /**
   * Handles user logout.
   */
  const handleLogout = useCallback(() => {
    logout().catch(console.error);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      {!loading && isAuthenticated && (
        <Button
          type="default"
          icon={<LogOut />}
          onClick={handleLogout}
          auto
          scale={0.6}
          aria-label="Logout"
          placeholder="Logout"
          onPointerEnterCapture={() => undefined}
          onPointerLeaveCapture={() => undefined}
        />
      )}
      <ThemeSwitcher onThemeChange={onThemeChange} />
    </div>
  );
};

/**
 * Application header with navigation and theme switcher.
 * @param {HeaderProps} props - Component props.
 * @param {Function} props.onThemeChange - Callback to change theme.
 * @returns {JSX.Element} Header component.
 */
const Header = ({ onThemeChange }: HeaderProps) => {
  const theme = useTheme();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background,
        padding: '0 16px',
        boxSizing: 'border-box',
        zIndex: 999,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          maxWidth: '1000px',
          borderBottom: `1px solid ${theme.palette.border}`,
        }}
      >
        <Logo />
        <Actions onThemeChange={onThemeChange} />
      </div>
    </header>
  );
};

export default Header;
