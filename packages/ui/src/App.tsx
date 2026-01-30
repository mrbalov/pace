import { Router, Route, Switch } from 'wouter';
import HomePage from './pages/HomePage';
import ActivitiesPage from './pages/ActivitiesPage';
import Header from './components/Header';

interface AppProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
}

/**
 * Main application component with routing.
 * @param {AppProps} root0 - Component props
 * @param {Function} root0.onThemeChange - Callback to change theme
 * @returns {JSX.Element} App component
 */
export default function App({ onThemeChange }: AppProps) {
  return (
    <>
      <Header onThemeChange={onThemeChange} />
      <div style={{ paddingTop: '60px' }}>
        <Router>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/activities" component={ActivitiesPage} />
            <Route>404 - Page Not Found</Route>
          </Switch>
        </Router>
      </div>
    </>
  );
}
