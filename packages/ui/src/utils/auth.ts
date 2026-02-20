/**
 * Authentication utilities for managing user session.
 */

/**
 * Clears all cookies by setting them to expire in the past.
 * Note: HTTP-only cookies cannot be cleared from JavaScript,
 * but this will clear any non-HTTP-only cookies.
 */
function clearCookies(): void {
  // Get all cookies
  const cookies = document.cookie.split(';');

  // Clear each cookie by setting it to expire in the past
  cookies.forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

    // Try to clear cookie for current domain and parent domains
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;

    // Also try with leading dot for subdomain cookies
    const parts = window.location.hostname.split('.');
    if (parts.length > 1) {
      const domain = '.' + parts.slice(-2).join('.');
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
    }
  });
}

/**
 * Logs out the user by clearing authentication cookies.
 * Calls backend logout endpoint to clear HTTP-only cookies,
 * then redirects to home page where auth status will be checked.
 *
 * @returns {Promise<void>} Promise that resolves when logout is complete
 */
export async function logout(): Promise<void> {
  // Save theme preference before clearing localStorage
  const theme = localStorage.getItem('theme');

  try {
    // Call backend logout endpoint to clear HTTP-only cookies
    await fetch('/strava/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout request failed:', error);
    // Continue with redirect even if backend call fails
  }

  // Clear client-side cookies (non-HTTP-only cookies)
  clearCookies();

  // Clear localStorage but preserve theme preference
  localStorage.clear();

  // Restore theme preference (user preference, not auth-related)
  if (theme) {
    localStorage.setItem('theme', theme);
  }

  // Redirect to home page - useAuthStatus hook will detect logout via auth status endpoint
  window.location.replace('/');
}
