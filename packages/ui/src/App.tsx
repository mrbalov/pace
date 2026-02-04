import { Router, Route, Switch } from 'wouter';
import { lazy } from 'react';

import Header from './components/Header';

const HomePageLazy = lazy(() => import('./pages/HomePage'));
const ActivitiesPageLazy = lazy(() => import('./pages/ActivitiesPage'));

interface AppProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
}

/**
 * Main application component with routing.
 * 
 * @param {AppProps} props - Component props.
 * @param {Function} props.onThemeChange - Callback to change theme.
 * @returns {JSX.Element} App component.
 */
const App = ({ onThemeChange }: AppProps) => (
  <>
    <Header onThemeChange={onThemeChange} />
    <div style={{ paddingTop: '60px' }}>
      <Router>
        <Switch>
          <Route path='/' component={HomePageLazy} />
          <Route path='/activities' component={ActivitiesPageLazy} />
          <Route>404 - Page Not Found</Route>
        </Switch>
      </Router>
    </div>
  </>
);

export default App;
