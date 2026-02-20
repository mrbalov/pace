'use client';

import { useCallback, useState } from 'react';
import { StravaActivity } from '@torq/strava-api';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-3xl font-bold">Your Last 30 Activities</h1>
      {activities.length > 0 ? (
        <ActivitiesList
          activities={activities}
          onGenerateImage={handleOpenImageGenerationDrawer}
        />
      ) : (
        <Alert>
          <AlertTitle>No Activities</AlertTitle>
          <AlertDescription>
            You don&apos;t have any activities yet. Start tracking your workouts on Strava!
          </AlertDescription>
        </Alert>
      )}
      <ImageGenerationDrawer
        activityId={currentActivityId}
        onClose={handleCloseImageGenerationDrawer}
      />
    </div>
  );
};

export default Activities;
