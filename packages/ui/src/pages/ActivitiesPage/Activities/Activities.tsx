import { useCallback, useState } from 'react';
import { Text, Grid, Note } from '@geist-ui/core';

import { Activity } from '../../../api/strava';
import { apiRequest } from '../../../api/client';
import ImageGenerationDrawer from './ImageGenerationDrawer';
import ActivitiesList from './ActivitiesList';

interface ActivitiesProps {
  activities: Activity[];
}

/**
 * API response type for image generation.
 */
interface ImageGenerationResponse {
  /** Generated image data. */
  image?: {
    /** Base64-encoded image data URL (data:image/png;base64,...). */
    imageData: string;
    /** Whether fallback prompt was used. */
    usedFallback: boolean;
    /** Number of retries performed. */
    retriesPerformed: number;
  };
}

/**
 * Activities list view.
 * @param {ActivitiesProps} props - Component props.
 * @param {Activity[]} props.activities - List of activities to display.
 * @returns {JSX.Element} Activities list view.
 */
const Activities = ({ activities }: ActivitiesProps) => {
  const [imageGenerationDrawerVisible, setImageGenerationDrawerVisible] = useState<boolean>(false);
  const [generatingImage, setGeneratingImage] = useState<boolean>(false);
  const [generatedImageData, setGeneratedImageData] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);

  /**
   * Handles closing the drawer and resetting state.
   * @returns {void}
   */
  const handleCloseImageGenerationDrawer = useCallback((): void => {
    setImageGenerationDrawerVisible(false);
    setGeneratingImage(false);
    setGeneratedImageData(null);
    setGenerationError(null);
    setCurrentActivityId(null);
  }, []);

  /**
   * Generates activity image.
   * Opens drawer, shows preloader, calls API, and displays result.
   * @param {number} activityId - Activity ID to generate image for.
   * @returns {Promise<void>} Promise that resolves when generation is complete.
   */
  const generateImage = useCallback(async (activityId: number): Promise<void> => {
    setCurrentActivityId(activityId);
    setImageGenerationDrawerVisible(true);
    setGeneratingImage(true);
    setGeneratedImageData(null);
    setGenerationError(null);

    try {
      const response = await apiRequest<ImageGenerationResponse>(
        `/activity-image-generator/${activityId}`,
      );

      if (response.image?.imageData) {
        setGeneratedImageData(response.image.imageData);
        setGeneratingImage(false);
      } else {
        setGenerationError('Image generation completed but no image data was returned.');
        setGeneratingImage(false);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
      setGenerationError('Failed to generate image. Please try again.');
      setGeneratingImage(false);
    }
  }, []);

  /**
   * Handles retry of image generation.
   */
  const handleRetry = useCallback((): void => {
    if (currentActivityId !== null) {
      generateImage(currentActivityId).catch(console.error);
    }
  }, [currentActivityId, generateImage]);

  return (
    <Grid.Container gap={2} width="100%" margin={0}>
      <Grid xs={24}>
        <Text h1>Your Last 30 Activities</Text>
      </Grid>
      {activities.length > 0 ? (
        <ActivitiesList activities={activities} generateImage={generateImage} />
      ) : (
        <Grid xs={24}>
          <Note type="default" label="No Activities">
            You don't have any activities yet. Start tracking your workouts on Strava!
          </Note>
        </Grid>
      )}
      <ImageGenerationDrawer
        activityId={currentActivityId?.toString()}
        visible={imageGenerationDrawerVisible}
        generatingImage={generatingImage}
        generatedImageData={generatedImageData}
        error={generationError}
        onClose={handleCloseImageGenerationDrawer}
        onRetry={handleRetry}
        setError={setGenerationError}
      />
    </Grid.Container>
  );
};

export default Activities;
