import { Card, Button, Text, Grid, Spacer, Loading, Note } from '@geist-ui/core';
import { Activity as ActivityIcon, Navigation, Clock, TrendingUp } from '@geist-ui/icons';
import { useEffect, useState } from 'react';
import { authorizeStrava } from '../api/strava';
import { useActivities } from '../api/hooks';

export default function HomePage() {
  const [skipAuth, setSkipAuth] = useState(false);
  const { activities, loading, error, refetch } = useActivities();
  const isAuthorized = activities !== null && !error;
  const isUnauthorized = error && (error.includes('Unauthorized') || error.includes('Authentication'));

  // Check if we just logged out
  useEffect(() => {
    const logoutFlag = sessionStorage.getItem('logout');
    const urlParams = new URLSearchParams(window.location.search);
    const hasLogoutParam = urlParams.has('logout');
    
    if (logoutFlag || hasLogoutParam) {
      // Clear the logout flag
      sessionStorage.removeItem('logout');
      // Clean up URL
      if (hasLogoutParam) {
        window.history.replaceState({}, '', '/');
      }
      // Skip auth check to show login screen immediately
      setSkipAuth(true);
    }
  }, []);

  // If we just logged out, skip loading and show login screen
  if (skipAuth) {
    return (
      <Grid.Container
        gap={2}
        justify="center"
        style={{ minHeight: 'calc(100vh - 60px)', alignContent: 'center' }}
      >
        <Grid xs={24} sm={20} md={16} lg={12} style={{ margin: '0 auto' }}>
          <Card width="100%">
            <Card.Content>
              <Text h2>Strava Activity Image Generator</Text>
              <Spacer h={1} />
              <Text>
                You have been logged out. Connect your Strava account to generate beautiful activity images.
              </Text>
            </Card.Content>
            <Card.Footer>
              <Button
                type="success"
                icon={<ActivityIcon />}
                onClick={authorizeStrava}
                width="100%"
              >
                Authorize with Strava
              </Button>
            </Card.Footer>
          </Card>
        </Grid>
      </Grid.Container>
    );
  }

  if (loading) {
    return (
      <Grid.Container
        gap={2}
        justify="center"
        style={{ minHeight: 'calc(100vh - 60px)', alignContent: 'center' }}
      >
        <Grid xs={24} style={{ textAlign: 'center' }}>
          <Loading size="large">Loading your activities...</Loading>
        </Grid>
      </Grid.Container>
    );
  }

  return (
    <Grid.Container gap={2} style={{ padding: '2rem', minHeight: 'calc(100vh - 60px)' }}>
      {isUnauthorized ? (
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
              >
                Authorize with Strava
              </Button>
            </Card.Footer>
          </Card>
        </Grid>
      ) : error ? (
        // Other error
        <Grid xs={24} sm={20} md={16} lg={12} style={{ margin: '0 auto' }}>
          <Note type="error" label="Error">
            {error}
          </Note>
          <Spacer h={1} />
          <Button onClick={refetch} width="100%">
            Try Again
          </Button>
        </Grid>
      ) : (
        // Authorized - show activities
        <>
          <Grid xs={24}>
            <Text h1>Your Activities</Text>
          </Grid>

          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <Grid xs={24} sm={12} md={8} lg={6} key={activity.id}>
                <Card width="100%" hoverable>
                  <Card.Content>
                    <Text h4>{activity.name}</Text>
                    <Text type="secondary" small>
                      {activity.type}
                    </Text>
                    <Spacer h={0.5} />
                    
                    <Text small>
                      <Navigation size={14} /> {(activity.distance / 1000).toFixed(2)} km
                    </Text>
                    <Text small>
                      <Clock size={14} /> {Math.floor(activity.moving_time / 60)} min
                    </Text>
                    <Text small>
                      <TrendingUp size={14} /> {activity.total_elevation_gain} m
                    </Text>
                  </Card.Content>
                  <Card.Footer>
                    <Button type="success" width="100%" scale={0.8}>
                      Generate Image
                    </Button>
                  </Card.Footer>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid xs={24}>
              <Note type="default" label="No Activities">
                You don't have any activities yet. Start tracking your workouts on Strava!
              </Note>
            </Grid>
          )}
        </>
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
