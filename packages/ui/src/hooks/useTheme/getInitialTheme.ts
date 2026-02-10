import { Theme } from '../../types';

/**
 * Gets initial theme from localStorage or system preference.
 * @returns {Theme} Initial theme.
 */
const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;

  if (savedTheme) {
    return savedTheme;
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return prefersDark ? 'dark' : 'light';
  }
};

export default getInitialTheme;
