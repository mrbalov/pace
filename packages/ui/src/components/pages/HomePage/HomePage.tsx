'use client';

import { useAuthStatus } from '@/hooks/useAuthStatus';
import Preloader from '@/components/atoms/Preloader';
import Deferred from '@/components/atoms/Deferred';

import useRemoveAuthUrlParams from './useRemoveAuthParams';
import Guest from './Guest';
import Member from './Member';

/**
 * Home page.
 * Shows login button or welcome message based on authentication status.
 * Uses /strava/auth/status endpoint to check auth - does not fetch activities.
 * @returns {JSX.Element} Home page.
 */
const HomePage = (): JSX.Element => {
  const { isAuthenticated, loading } = useAuthStatus();

  useRemoveAuthUrlParams();

  return (
    <Deferred ready={!loading} fallback={<Preloader />}>
      {isAuthenticated ? <Member /> : <Guest />}
    </Deferred>
  );
};

export default HomePage;
