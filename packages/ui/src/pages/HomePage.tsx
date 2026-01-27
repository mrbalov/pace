import { Card, Button, Text, Grid, Spacer, Loading } from '@geist-ui/core';
import { Activity as ActivityIcon, ArrowRight } from '@geist-ui/icons';
import { Link } from 'wouter';
import { authorizeStrava } from '../api/strava';
import { useAuthStatus } from '../hooks/useAuthStatus';

/**
 * Home page component.
 * Shows login button or welcome message based on authentication status.
 * Uses /strava/auth/status endpoint to check auth - does not fetch activities.
 *
 * @returns {JSX.Element} Home page component
 */
const HomePage = (): JSX.Element => {
  const { isAuthenticated, loading } = useAuthStatus();

  if (loading) {
    return (
      <Grid.Container
        gap={2}
        justify="center"
        style={{ minHeight: 'calc(100vh - 60px)', alignContent: 'center' }}
      >
        <Grid xs={24} style={{ textAlign: 'center' }}>
          <Loading>Checking authentication...</Loading>
        </Grid>
      </Grid.Container>
    );
  }

  return (
    <Grid.Container gap={2} style={{ padding: '2rem', minHeight: 'calc(100vh - 60px)' }}>
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
                  iconRight={<ArrowRight />}
                  width="100%"
                  placeholder="View Activities"
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  View Activities
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
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
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
};

export default HomePage;
