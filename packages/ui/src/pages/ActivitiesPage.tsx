import { Card, Button, Text, Grid, Spacer, Loading, Note } from '@geist-ui/core';
import { Activity as ActivityIcon, Navigation, Clock, TrendingUp, Zap, ArrowLeft } from '@geist-ui/icons';
import { Link } from 'wouter';
import { useActivities } from '../api/hooks';

/**
 * Formats activity type to a friendly display name.
 *
 * @param {string} type - Activity type from Strava API
 * @returns {string} Formatted activity type name
 * @internal
 */
const formatActivityType = (type: string): string => {
  const typeMappings: Record<string, string> = {
    'Weighttraining': 'Weight Training',
    'weighttraining': 'Weight Training',
    'WeightTraining': 'Weight Training',
  };

  if (typeMappings[type]) {
    return typeMappings[type];
  }

  return type
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Activities page component for listing Strava activities.
 * Shows activities with error handling and loading states.
 *
 * @returns {JSX.Element} Activities page component
 */
const ActivitiesPage = (): JSX.Element => {
  const { activities, loading, error, isUnauthorized, refetch } = useActivities();

  if (loading) {
    return (
      <Grid.Container
        gap={2}
        justify="center"
        style={{ minHeight: 'calc(100vh - 60px)', alignContent: 'center' }}
      >
        <Grid xs={24} style={{ textAlign: 'center' }}>
          <Loading>Loading your activities...</Loading>
        </Grid>
      </Grid.Container>
    );
  }

  if (isUnauthorized) {
    return (
      <Grid.Container gap={2} style={{ padding: '2rem', minHeight: 'calc(100vh - 60px)' }}>
        <Grid xs={24} sm={20} md={16} lg={12} style={{ margin: '0 auto' }}>
          <Card width="100%">
            <Card.Content>
              <Text h2>Authentication Required</Text>
              <Spacer h={1} />
              <Text>
                Please connect your Strava account to view your activities.
              </Text>
            </Card.Content>
            <Card.Footer>
              <Link href="/">
                <Button
                  width="100%"
                  icon={<ArrowLeft />}
                  placeholder="Go to Home"
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  Go to Home
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Grid>
      </Grid.Container>
    );
  }

  if (error) {
    return (
      <Grid.Container gap={2} style={{ padding: '2rem', minHeight: 'calc(100vh - 60px)' }}>
        <Grid xs={24} sm={20} md={16} lg={12} style={{ margin: '0 auto' }}>
          <Card width="100%">
            <Card.Content>
              <Note type="error" label="Error">
                <Text>
                  {error}
                </Text>
                <Spacer h={1} />
                <Text type="secondary" small>
                  We encountered an issue while fetching your activities. Please try again.
                </Text>
              </Note>
            </Card.Content>
            <Card.Footer>
              <Button
                onClick={refetch}
                width="100%"
                placeholder="Try Again"
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                Try Again
              </Button>
            </Card.Footer>
          </Card>
        </Grid>
      </Grid.Container>
    );
  }

  return (
    <Grid.Container gap={2} style={{ padding: '2rem', minHeight: 'calc(100vh - 60px)' }}>
      <Grid xs={24} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/">
          <Button
            auto
            size="small"
            icon={<ArrowLeft />}
            placeholder="Back"
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Back
          </Button>
        </Link>
        <Text h1 style={{ margin: 0 }}>Your Activities</Text>
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
                
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  {activity.type && (
                    <Text small>
                      <ActivityIcon size={14} /> {formatActivityType(activity.type)}
                    </Text>
                  )}
                  {activity.distance > 0 && (
                    <Text small>
                      <Navigation size={14} /> {(activity.distance / 1000).toFixed(2)} km
                    </Text>
                  )}
                  {activity.moving_time > 0 && (
                    <Text small>
                      <Clock size={14} /> {Math.floor(activity.moving_time / 60)} min
                    </Text>
                  )}
                  {activity.total_elevation_gain != null && activity.total_elevation_gain > 0 && (
                    <Text small>
                      <TrendingUp size={14} /> {activity.total_elevation_gain} m
                    </Text>
                  )}
                </div>
              </Card.Content>
              <Card.Footer>
                <Button 
                  type="success" 
                  width="100%" 
                  scale={0.8}
                  icon={<Zap />}
                  placeholder="Generate Image"
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
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
    </Grid.Container>
  );
};

export default ActivitiesPage;
