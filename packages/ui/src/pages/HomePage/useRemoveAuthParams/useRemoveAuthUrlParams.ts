import { useEffect } from 'react';

import removeAuthParams from './removeAuthParams';

/**
 * Removes OAuth callback parameters from URL.
 * Security: don't expose internal OAuth details.
 */
const useRemoveAuthUrlParams = (): void => {
  useEffect(() => {
    removeAuthParams();
  }, []);
};

export default useRemoveAuthUrlParams;
