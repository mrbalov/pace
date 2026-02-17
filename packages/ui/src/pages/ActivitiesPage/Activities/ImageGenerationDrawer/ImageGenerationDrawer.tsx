import { useMemo } from 'react';
import { X } from '@geist-ui/icons';
import { Button, Text, Drawer, Card, Grid } from '@geist-ui/core';

import { useStravaActivitySignalsData } from '../../../../api';
import Signals from './Signals';
import Image from './Image';

interface ImageGenerationDrawerProps {
  visible: boolean;
  generatingImage: boolean;
  generatedImageData?: string | null;
  activityId?: string;
  error?: string | null;
  setError: (error: string) => void;
  onClose: () => void;
  onRetry: () => void;
}

interface TitleProps {
  generatingImage: boolean;
  generatedImageData?: string | null;
  onClose: () => void;
}

interface ContentProps {
  generatingImage: boolean;
  imageData?: string | null;
  error?: string | null;
  activityId?: string;
  onRetry: () => void;
  setError: (error: string) => void;
}

/**
 * Drawer title component.
 * @param {TitleProps} props - Component props.
 * @param {boolean} props.generatingImage - Whether the image is being generated.
 * @param {string | null} [props.generatedImageData] - Generated image data URL.
 * @param {Function} props.onClose - Function to handle drawer close.
 * @returns {JSX.Element} Drawer title component.
 */
const Title = ({ generatingImage, generatedImageData, onClose }: TitleProps) => {
  const title = useMemo(() => {
    if (generatingImage) {
      return 'Generating Image...';
    } else if (generatedImageData) {
      return 'Generated Image';
    } else {
      return 'Image Generation';
    }
  }, [generatingImage, generatedImageData]);

  return (
    <Drawer.Title
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {title}
      <Button
        onClick={onClose}
        auto
        scale={0.6}
        icon={<X />}
        placeholder="Close"
        onPointerEnterCapture={() => undefined}
        onPointerLeaveCapture={() => undefined}
      />
    </Drawer.Title>
  );
};

/**
 * Drawer content component.
 * @param {ContentProps} props - Component props.
 * @param {boolean} props.generatingImage - Whether the image is being generated.
 * @param {string | null} [props.imageData] - Generated image data URL.
 * @param {string | null} [props.error] - Error message if generation failed.
 * @param {string} [props.activityId] - ID of the activity for which the image is being generated.
 * @param {Function} props.onRetry - Function to retry image generation.
 * @param {Function} props.setError - Function to set error message.
 * @returns {JSX.Element} Drawer content component.
 */
const Content = ({
  generatingImage,
  imageData,
  error,
  onRetry,
  setError,
  activityId,
}: ContentProps) => {
  const signalsData = useStravaActivitySignalsData(activityId);

  return (
    <Drawer.Content>
      <Grid.Container gap={2} justify="center">
        <Grid xs={24}>
          <Card>
            <Text small type="warning">
              The activity image is being generated using an external AI service.{' '}
              <strong>AI is not a human, so it makes mistakes.</strong> Please make sure the
              generated image is appropriate before publishing it to your Strava profile.
            </Text>
          </Card>
        </Grid>
        <Grid xs={24}>
          <Image
            isLoading={generatingImage}
            error={error}
            onRetry={onRetry}
            imageData={imageData}
            setError={setError}
          />
        </Grid>
        <Grid xs={24}>
          <Signals
            isLoading={signalsData.isLoading}
            isLoaded={signalsData.isLoaded}
            signals={signalsData.data}
          />
        </Grid>
      </Grid.Container>
    </Drawer.Content>
  );
};

/**
 * Image generation drawer.
 * @param {ImageGenerationDrawerProps} props Component props.
 * @param {boolean} props.visible Whether the drawer is visible.
 * @param {boolean} props.generatingImage Whether the image is being generated.
 * @param {string | null} [props.generatedImageData] Generated image data URL.
 * @param {string | null} [props.error] Error message if generation failed.
 * @param {string} [props.activityId] ID of the activity for which the image is being generated.
 * @param {Function} props.setError Function to set error message.
 * @param {Function} props.onClose Function to handle drawer close.
 * @param {Function} props.onRetry Function to retry image generation.
 * @returns {JSX.Element} Image generation drawer.
 */
const ImageGenerationDrawer = ({
  error,
  visible,
  generatingImage,
  generatedImageData,
  activityId,
  onClose,
  onRetry,
  setError,
}: ImageGenerationDrawerProps) => (
  <Drawer visible={visible} onClose={onClose} placement="right" width="500px">
    <Title
      generatingImage={generatingImage}
      generatedImageData={generatedImageData}
      onClose={onClose}
    />
    <Content
      generatingImage={generatingImage}
      imageData={generatedImageData}
      error={error}
      onRetry={onRetry}
      setError={setError}
      activityId={activityId}
    />
  </Drawer>
);

export default ImageGenerationDrawer;
