import { Text, Button } from '@geist-ui/core';
import { useLocation } from 'wouter';
import { LogOut } from '@geist-ui/icons';
import { logout } from '../utils/auth';
import { useAuth } from '../hooks/useAuth';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
}

/**
 * Application header with navigation and theme switcher.
 * @param {HeaderProps} root0 - Component props
 * @param {Function} root0.onThemeChange - Callback to change theme
 * @returns {JSX.Element} Header component
 */
export default function Header({ onThemeChange }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  /**
   * Handles user logout.
   * @returns {Promise<void>}
   */
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        borderBottom: '1px solid var(--geist-border)',
        backgroundColor: 'var(--geist-background)',
        zIndex: 999,
      }}
    >
      <Text
        h3
        style={{
          margin: 0,
          fontWeight: 600,
          cursor: location === '/' ? 'default' : 'pointer',
        }}
        onClick={() => {
          if (location !== '/') {
            setLocation('/');
          }
        }}
      >
        PACE
      </Text>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {!loading && isAuthenticated && (
          <Button
            type="abort"
            icon={<LogOut />}
            onClick={() => {
              void handleLogout();
            }}
            scale={0.8}
            placeholder="Logout"
            onPointerEnterCapture={() => undefined}
            onPointerLeaveCapture={() => undefined}
          >
            Logout
          </Button>
        )}
        <ThemeSwitcher onThemeChange={onThemeChange} />
      </div>
    </header>
  );
}
