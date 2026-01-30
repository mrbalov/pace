import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import App from './App';

/**
 *
 */
function Root() {
  // Initialize theme synchronously to prevent flash
  /**
   *
   */
  const getInitialTheme = (): 'light' | 'dark' => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      return savedTheme;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [themeType, setThemeType] = useState<'light' | 'dark'>(getInitialTheme);

  // Sync data-theme attribute when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeType);
  }, [themeType]);

  /**
   *
   * @param newTheme
   */
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setThemeType(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />
      <App onThemeChange={handleThemeChange} />
    </GeistProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
