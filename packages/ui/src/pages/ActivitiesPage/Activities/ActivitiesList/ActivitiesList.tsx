import { Card, Button, Text, Grid, Spacer } from '@geist-ui/core';
import { Activity as ActivityIcon, Navigation, Clock, TrendingUp, Zap } from '@geist-ui/icons';
import { StravaActivity } from '@torq/strava-api';

import formatActivityType from './formatActivityType';

interface ActivitiesListProps {
  activities: StravaActivity[];
  onGenerateImage: (activityId: string) => void;
}

/**
 * Activities list view.
 * @param {ActivitiesListProps} props - Component props.
 * @param {StravaActivity[]} props.activities - List of activities to display.
 * @param {Function} props.onGenerateImage - Function to open the activity image generation view.
 * @returns {JSX.Element} Activities list view.
 */
const ActivitiesList = ({ activities, onGenerateImage }: ActivitiesListProps) =>
  activities.map((activity) => (
    <Grid xs={24} sm={12} md={8} key={activity.id}>
      <Card width="100%" hoverable>
        <Card.Content>
          <Text h4>{activity.name}</Text>
          <Text type="secondary" small>
            {formatActivityType(activity.type)}
          </Text>
          <Spacer h={0.5} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            {activity.type && (
              <Text small>
                <ActivityIcon size={14} /> {formatActivityType(activity.type)}
              </Text>
            )}
            {(activity?.distance ?? 0) > 0 && (
              <Text small>
                <Navigation size={14} /> {((activity.distance ?? 0) / 1000).toFixed(2)} km
              </Text>
            )}
            {(activity?.moving_time ?? 0) > 0 && (
              <Text small>
                <Clock size={14} /> {Math.floor((activity.moving_time ?? 0) / 60)} min
              </Text>
            )}
            {(activity?.total_elevation_gain ?? 0) > 0 && (
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
            onClick={() => {
              onGenerateImage(String(activity.id));
            }}
            placeholder="Generate Image"
            onPointerEnterCapture={() => undefined}
            onPointerLeaveCapture={() => undefined}
          >
            Generate Image
          </Button>
        </Card.Footer>
      </Card>
    </Grid>
  ));

export default ActivitiesList;
