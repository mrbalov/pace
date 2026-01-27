import { Text, Button } from '@geist-ui/core';
import { useLocation } from 'wouter';
import { LogOut, Sun, Moon } from '@geist-ui/icons';
import { useTheme } from '@geist-ui/core';
import { logout } from '../utils/auth';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export default function Header({ onThemeChange }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    const newTheme = theme.type === 'dark' ? 'light' : 'dark';
    onThemeChange(newTheme);
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
        <Button
          auto
          icon={theme.type === 'dark' ? <Sun /> : <Moon />}
          onClick={toggleTheme}
          scale={0.8}
          aria-label={`Switch to ${theme.type === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme.type === 'dark' ? 'light' : 'dark'} mode`}
        />
        
        {!loading && isAuthenticated && (
          <Button
            auto
            type="abort"
            icon={<LogOut />}
            onClick={handleLogout}
            scale={0.8}
          >
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}
