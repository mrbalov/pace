import { Router, Route, Switch } from 'wouter';
import { lazy, Suspense } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import { Theme } from './types';

const HomePageLazy = lazy(() => import('./pages/HomePage'));
const ActivitiesPageLazy = lazy(() => import('./pages/ActivitiesPage'));

interface AppProps {
  onThemeChange: (theme: Theme) => void;
}

/**
 * Main application component with routing.
 *
 * @param {AppProps} props - Component props.
 * @param {Function} props.onThemeChange - Callback to change theme.
 * @returns {JSX.Element} Main app component with routing.
 */
const App = ({ onThemeChange }: AppProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '32px',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '0 16px',
      boxSizing: 'border-box',
    }}
  >
    <Header onThemeChange={onThemeChange} />
    <main
      aria-live="polite"
      role="main"
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 170px)', // Adjust for header and footer height
        margin: '70px 0',
      }}
    >
      <Suspense fallback={<Preloader />}>
        <Router>
          <Switch>
            <Route path="/" component={HomePageLazy} />
            <Route path="/activities" component={ActivitiesPageLazy} />
            <Route>404 - Page Not Found</Route>
          </Switch>
        </Router>
      </Suspense>
    </main>
    <Footer />
  </div>
);

export default App;
