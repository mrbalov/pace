import { Router, Route, Switch } from 'wouter';
import HomePage from './pages/HomePage';
import ActivitiesPage from './pages/ActivitiesPage';
import Header from './components/Header';

interface AppProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
}

/**
 *
 * @param root0
 * @param root0.onThemeChange
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
