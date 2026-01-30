import { Card, Button, Text, Grid, Spacer } from '@geist-ui/core';
import { Activity as ActivityIcon } from '@geist-ui/icons';
import { Link } from 'wouter';
import { useState, useEffect } from 'react';
import { authorizeStrava } from '../api/strava';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Preloader from '../components/Preloader';

/**
 * Home page component.
 * Shows login button or welcome message based on authentication status.
 * Uses /strava/auth/status endpoint to check auth - does not fetch activities.
 *
 * @returns {JSX.Element} Home page component
 */
const HomePage = (): JSX.Element => {
  const { isAuthenticated, loading } = useAuthStatus();
  const [showContent, setShowContent] = useState(false);

  // Remove OAuth callback parameters from URL (security: don't expose internal OAuth details)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthParams = ['code', 'state', 'scope'];
    // eslint-disable-next-line no-restricted-syntax
    let hasOAuthParams = false;

    oauthParams.forEach((param) => {
      if (urlParams.has(param)) {
        urlParams.delete(param);
        hasOAuthParams = true;
      }
    });

    if (hasOAuthParams) {
      const cleanUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
      window.history.replaceState({}, '', cleanUrl);
    }
  }, []);

  // Handle smooth transition from preloader to content
  useEffect(() => {
    if (!loading) {
      // Small delay to allow preloader fade-out before showing content
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 600);
      return () => { clearTimeout(timer); };
    } else {
      setShowContent(false);
    }
  }, [loading]);

  if (loading || !showContent) {
    return <Preloader />;
  } else {
    return (
      <Grid.Container 
        gap={2} 
        style={{ 
          padding: '2rem', 
          minHeight: 'calc(100vh - 60px)',
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
          backgroundColor: 'var(--geist-background)',
        }}
      >
        {isAuthenticated ? (
          // Authorized - show welcome message with link to activities
          <Grid xs={24} sm={20} md={16} lg={12} style={{ margin: '0 auto' }}>
            <Card width="100%">
              <Card.Content>
                <Text h2>Welcome to PACE!</Text>
                <Spacer h={1} />
                <Text>
                  You're successfully connected to Strava. Review your activities and generate beautiful AI images for them.
                </Text>
              </Card.Content>
              <Card.Footer>
                <Link href="/activities">
                  <Button
                    type="success"
                    icon={<ActivityIcon />}
                    width="100%"
                    placeholder="View Activities"
                    onPointerEnterCapture={() => undefined}
                    onPointerLeaveCapture={() => undefined}
                  >
                    <span style={{ marginLeft: '0.5rem' }}>View Activities</span>
                  </Button>
                </Link>
              </Card.Footer>
            </Card>
          </Grid>
        ) : (
          // Not authorized - show authorize button
          <Grid xs={24} sm={20} md={16} lg={12} style={{ margin: '0 auto' }}>
            <Card width="100%">
              <Card.Content>
                <Text h2>Strava Activity Image Generator</Text>
                <Spacer h={1} />
                <Text>
                  Connect your Strava account to generate beautiful activity images.
                </Text>
              </Card.Content>
              <Card.Footer>
                <Button
                  type="success"
                  icon={<ActivityIcon />}
                  onClick={authorizeStrava}
                  width="100%"
                  placeholder="Authorize with Strava"
                  onPointerEnterCapture={() => undefined}
                  onPointerLeaveCapture={() => undefined}
                >
                  Authorize with Strava
                </Button>
              </Card.Footer>
            </Card>
          </Grid>
        )}
  
        {/* Project description at the bottom */}
        <Grid xs={24} style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--geist-border)' }}>
          <Card width="100%">
            <Card.Content>
              <Text h3>About PACE</Text>
              <Spacer h={0.5} />
              <Text>
                PACE is a Strava Activity Image Generator that helps you create beautiful visualizations
                of your athletic activities. Connect your Strava account to get started and transform
                your workout data into stunning images.
              </Text>
            </Card.Content>
          </Card>
        </Grid>
      </Grid.Container>
    );
  }
};

export default HomePage;
