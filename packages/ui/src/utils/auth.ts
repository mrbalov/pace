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
 * Clears all localStorage data.
 */
function clearLocalStorage(): void {
  localStorage.clear();
}

/**
 * Logs out the user by clearing all session data.
 * After logout, the page will refresh to show the login state.
 * 
 * Note: HTTP-only cookies cannot be cleared from JavaScript.
 * The backend cookies will remain until they expire or are cleared by the backend.
 * We use a hard refresh with cache-busting to ensure a fresh state.
 */
export function logout(): void {
  // Save theme preference before clearing localStorage
  const theme = localStorage.getItem('theme');
  
  // Clear all data
  clearCookies();
  clearLocalStorage();
  
  // Restore theme preference (user preference, not auth-related)
  if (theme) {
    localStorage.setItem('theme', theme);
  }
  
  // Set a logout flag in sessionStorage to prevent activities from loading
  sessionStorage.setItem('logout', 'true');
  
  // Force a hard refresh with cache-busting to ensure fresh state
  // Use replace to prevent back button from going to logged-in state
  window.location.replace(`/?logout=${Date.now()}`);
}

/**
 * Checks if user is logged in by checking if we have auth data.
 * This is a simple check - actual auth state is determined by API calls.
 */
export function isLoggedIn(): boolean {
  // Check if theme preference exists (indicates user has been here before)
  // But more importantly, we'll check this via the activities hook
  // For now, return true if localStorage has theme preference
  return localStorage.getItem('theme') !== null;
}
