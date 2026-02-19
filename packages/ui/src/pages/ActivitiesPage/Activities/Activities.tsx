import { useCallback, useState } from 'react';
import { Text, Grid, Note } from '@geist-ui/core';
import { StravaActivity } from '@torq/strava-api';

import ImageGenerationDrawer from './ImageGenerationDrawer';
import ActivitiesList from './ActivitiesList';

interface ActivitiesProps {
  activities: StravaActivity[];
}

/**
 * Activities list view.
 * @param {ActivitiesProps} props - Component props.
 * @param {StravaActivity[]} props.activities - List of activities to display.
 * @returns {JSX.Element} Activities list view.
 */
const Activities = ({ activities }: ActivitiesProps) => {
  const [currentActivityId, setCurrentActivityId] = useState<string | null>(null);

  /**
   * Handles opening the drawer and setting the current activity ID.
   * @param {string} activityId - ID of the activity to generate an image for.
   * @returns {void}
   */
  const handleOpenImageGenerationDrawer = useCallback((activityId: string): void => {
    setCurrentActivityId(activityId);
  }, []);

  /**
   * Handles closing the image generation drawer.
   * @returns {void}
   */
  const handleCloseImageGenerationDrawer = useCallback((): void => {
    setCurrentActivityId(null);
  }, []);

  return (
    <Grid.Container gap={2} width="100%" margin={0}>
      <Grid xs={24}>
        <Text h1>Your Last 30 Activities</Text>
      </Grid>
      {activities.length > 0 ? (
        <ActivitiesList
          activities={activities}
          onGenerateImage={handleOpenImageGenerationDrawer}
        />
      ) : (
        <Grid xs={24}>
          <Note type="default" label="No Activities">
            You don't have any activities yet. Start tracking your workouts on Strava!
          </Note>
        </Grid>
      )}
      <ImageGenerationDrawer
        activityId={currentActivityId}
        onClose={handleCloseImageGenerationDrawer}
      />
    </Grid.Container>
  );
};

export default Activities;
