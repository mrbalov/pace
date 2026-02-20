'use client';

import { AUTH_PARAMS } from './constants';

/**
 * Removes OAuth callback parameters from URL.
 * Security: don't expose internal OAuth details.
 * No-op during SSR when browser APIs are unavailable.
 * @returns {void}
 */
const removeAuthParams = (): void => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-restricted-syntax
    let hasAuthParams = false;
    const urlParams = new URLSearchParams(window.location.search);

    AUTH_PARAMS.forEach((param) => {
      if (urlParams.has(param)) {
        urlParams.delete(param);
        hasAuthParams = true;
      }
    });

    if (hasAuthParams) {
      const newUrlParams = urlParams.toString() ? `?${urlParams.toString()}` : '';
      const cleanUrl = `${window.location.pathname}${newUrlParams}`;

      window.history.replaceState({}, '', cleanUrl);
    }
  }
};

export default removeAuthParams;
