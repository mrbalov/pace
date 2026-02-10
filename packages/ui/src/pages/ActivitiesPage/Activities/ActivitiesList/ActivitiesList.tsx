import { Card, Button, Text, Grid, Spacer } from '@geist-ui/core';
import { Activity as ActivityIcon, Navigation, Clock, TrendingUp, Zap } from '@geist-ui/icons';

import { Activity } from '../../../../api/strava';
import formatActivityType from './formatActivityType';

interface ActivitiesListProps {
  activities: Activity[];
  generateImage: (activityId: number) => Promise<void>;
}

/**
 * Activities list view.
 * @param {ActivitiesListProps} props - Component props.
 * @param {Activity[]} props.activities - List of activities to display.
 * @param {Function} props.generateImage - Function to generate image for an activity.
 * @returns {JSX.Element} Activities list view.
 */
const ActivitiesList = ({ activities, generateImage }: ActivitiesListProps) =>
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
            onClick={() => {
              generateImage(activity.id).catch(console.error);
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
