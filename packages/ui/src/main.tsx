import React from 'react';
import { createRoot } from 'react-dom/client';
import { GeistProvider, CssBaseline } from '@geist-ui/core';

import App from './App';
import useTheme from './hooks/useTheme';

/**
 * Root component that provides theme context.
 * @returns {JSX.Element} Root component
 */
const Root = () => {
  const { theme, onThemeChange } = useTheme();

  return (
    <GeistProvider themeType={theme}>
      <CssBaseline />
      <App onThemeChange={onThemeChange} />
    </GeistProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
