import { Card, Button, Text, Grid, Spacer, Note, Drawer } from '@geist-ui/core';
import { Activity as ActivityIcon, Navigation, Clock, TrendingUp, Zap, ArrowLeft, X, Download } from '@geist-ui/icons';
import { Link } from 'wouter';
import { useState, useEffect } from 'react';
import { useActivities } from '../api/hooks';
import { apiRequest } from '../api/client';
import Preloader from '../components/Preloader';

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
  const [showContent, setShowContent] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageData, setGeneratedImageData] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);

  /**
   * Handles image generation request for an activity.
   * Opens drawer, shows preloader, calls API, and displays result.
   *
   * @param {number} activityId - Activity ID to generate image for
   */
  const handleGenerateImage = async (activityId: number): Promise<void> => {
    setCurrentActivityId(activityId);
    setDrawerVisible(true);
    setGeneratingImage(true);
    setGeneratedImageData(null);
    setGenerationError(null);

    try {
      const response = await apiRequest<ImageGenerationResponse>(
        `/activity-image-generator/${activityId}`
      );
      
      if (response.image?.imageData) {
        const imageData = response.image.imageData;
        console.info('Image data received:', imageData.substring(0, 50) + '...');
        setGeneratedImageData(imageData);
        setGeneratingImage(false);
      } else {
        setGenerationError('Image generation completed but no image data was returned.');
        setGeneratingImage(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image. Please try again.';
      setGenerationError(errorMessage);
      setGeneratingImage(false);
    }
  };

  /**
   * Handles closing the drawer and resetting state.
   */
  const handleCloseDrawer = (): void => {
    setDrawerVisible(false);
    setGeneratingImage(false);
    setGeneratedImageData(null);
    setGenerationError(null);
    setCurrentActivityId(null);
  };

  /**
   * Handles retry of image generation.
   */
  const handleRetry = (): void => {
    if (currentActivityId !== null) {
      handleGenerateImage(currentActivityId).catch(console.error);
    }
  };

  /**
   * Handles downloading the generated image.
   * Converts base64 data URL to blob and triggers a download.
   *
   * @param {string} imageData - Base64-encoded image data URL
   */
  const handleDownloadImage = async (imageData: string): Promise<void> => {
    try {
      // Convert data URL to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'activity-image.png';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to download image. Please try again.';
      setGenerationError(errorMessage);
    }
  };

  // Handle smooth transition from preloader to content
  useEffect(() => {
    if (!loading) {
      // Small delay to allow preloader fade-out before showing content
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 600);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setShowContent(false);
    }
  }, [loading]);

  if (loading || !showContent) {
    return <Preloader message="Loading your activities..." />;
  }

  if (isUnauthorized) {
    return (
      <Grid.Container gap={2} style={{ padding: '2rem', minHeight: 'calc(100vh - 60px)', backgroundColor: 'var(--geist-background)' }}>
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
                  onPointerEnterCapture={() => undefined}
                  onPointerLeaveCapture={() => undefined}
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
      <Grid.Container gap={2} style={{ padding: '2rem', minHeight: 'calc(100vh - 60px)', backgroundColor: 'var(--geist-background)' }}>
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
                onPointerEnterCapture={() => undefined}
                onPointerLeaveCapture={() => undefined}
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
      <Grid xs={24} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/">
          <Button
            auto
            icon={<ArrowLeft />}
            placeholder="Back"
            onPointerEnterCapture={() => undefined}
            onPointerLeaveCapture={() => undefined}
          >
            Back
          </Button>
        </Link>
        <Text h1 style={{ margin: 0 }}>Your Activities</Text>
      </Grid>

      {activities && Array.isArray(activities) && activities.length > 0 ? (
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
                  onClick={() => {
                    handleGenerateImage(activity.id).catch(console.error);
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
        ))
      ) : (
        <Grid xs={24}>
          <Note type="default" label="No Activities">
            You don't have any activities yet. Start tracking your workouts on Strava!
          </Note>
        </Grid>
      )}

      <Drawer
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        placement="right"
        width="600px"
      >
        <Drawer.Title>
          {generatingImage ? 'Generating Image...' : generatedImageData ? 'Generated Image' : 'Image Generation'}
        </Drawer.Title>
        <Drawer.Content>
          {generatingImage ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '400px',
              padding: '2rem'
            }}>
              <Preloader message="Creating your activity image..." fullHeight={false} />
            </div>
          ) : generationError ? (
            <div style={{ padding: '2rem' }}>
              <Note type="error" label="Error">
                <Text>
                  {generationError}
                </Text>
                <Spacer h={1} />
                <Button
                  onClick={handleRetry}
                  type="success"
                  width="100%"
                  placeholder="Try Again"
                  onPointerEnterCapture={() => undefined}
                  onPointerLeaveCapture={() => undefined}
                >
                  Try Again
                </Button>
              </Note>
            </div>
          ) : generatedImageData ? (
            <div style={{ padding: '1rem' }}>
              <img
                src={generatedImageData}
                alt="Generated activity image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  borderRadius: '8px',
                  display: 'block',
                  marginBottom: '1rem',
                }}
                onLoad={() => {
                  console.info('Image loaded successfully');
                }}
                onError={(e) => {
                  console.error('Image load error:', e);
                  setGenerationError(`Failed to load the generated image. Please check the browser console for details.`);
                }}
              />
              <Button
                onClick={() => {
                  handleDownloadImage(generatedImageData).catch(console.error);
                }}
                type="success"
                width="100%"
                icon={<Download />}
                placeholder="Download Image"
                onPointerEnterCapture={() => undefined}
                onPointerLeaveCapture={() => undefined}
              >
                Download Image
              </Button>
            </div>
          ) : null}
        </Drawer.Content>
        <Drawer.Subtitle>
          <Button
            onClick={handleCloseDrawer}
            auto
            icon={<X />}
            placeholder="Close"
            onPointerEnterCapture={() => undefined}
            onPointerLeaveCapture={() => undefined}
          >
            Close
          </Button>
        </Drawer.Subtitle>
      </Drawer>
    </Grid.Container>
  );
};

export default ActivitiesPage;
