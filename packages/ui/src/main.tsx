import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import App from './App';

function Root() {
  const [themeType, setThemeType] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setThemeType(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeType(prefersDark ? 'dark' : 'light');
    }
  }, []);

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
