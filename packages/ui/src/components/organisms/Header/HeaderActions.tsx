'use client';

import { useCallback } from 'react';
import { LogOut } from 'lucide-react';

import { logout } from '@/utils/auth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '@/components/molecules/ThemeSwitcher';

/**
 * Header actions.
 * Handles authentication state, logout, and theme switching.
 * @returns {JSX.Element} HeaderActions component.
 */
const HeaderActions = () => {
  const { isAuthenticated, loading } = useAuth();

  /**
   * Handles user logout.
   * @returns {void}
   */
  const handleLogout = useCallback(() => {
    logout().catch(console.error);
  }, []);

  return (
    <div className="flex items-center gap-4">
      {!loading && isAuthenticated && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut />
        </Button>
      )}
      <ThemeSwitcher />
    </div>
  );
};

export default HeaderActions;
