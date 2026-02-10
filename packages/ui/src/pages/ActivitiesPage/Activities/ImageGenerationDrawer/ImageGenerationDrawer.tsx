import { Button, Text, Spacer, Note, Drawer, Card, Grid } from '@geist-ui/core';
import { X, Download } from '@geist-ui/icons';

import Preloader from '../../../../components/Preloader';
import { useMemo } from 'react';

interface ImageGenerationDrawerProps {
  visible: boolean;
  generatingImage: boolean;
  generatedImageData?: string | null;
  error?: string | null;
  setError: (error: string) => void;
  onClose: () => void;
  onRetry: () => void;
  downloadImage: (imageData: string) => Promise<void>;
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
  onRetry: () => void;
  setError: (error: string) => void;
  downloadImage: (imageData: string) => Promise<void>;
}

interface ImageGenerationErrorProps {
  error: string;
  onRetry: () => void;
}

interface ImageGenerationResultProps {
  imageData: string;
  setError: (error: string) => void;
  downloadImage: (imageData: string) => Promise<void>;
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
 * Image generation preloader component.
 * @returns {JSX.Element} Image generation preloader component.
 */
const ImageGenerationPreloader = () => (
  <Grid xs={24}>
    <Preloader message="Creating your activity image..." withFullHeight={false} />
  </Grid>
);

/**
 * Image generation error component.
 * @param {ImageGenerationErrorProps} props - Component props.
 * @param {string} props.error - Error message to display.
 * @param {Function} props.onRetry - Function to retry image generation.
 * @returns {JSX.Element} Image generation error component.
 */
const ImageGenerationError = ({ error, onRetry }: ImageGenerationErrorProps) => (
  <Grid xs={24}>
    <Note type="error" label="Error">
      <Text>{error}</Text>
      <Spacer h={1} />
      <Button
        onClick={onRetry}
        type="success"
        width="100%"
        placeholder="Try Again"
        onPointerEnterCapture={() => undefined}
        onPointerLeaveCapture={() => undefined}
      >
        Try Again
      </Button>
    </Note>
  </Grid>
);

/**
 * Image generation result component.
 * @param {ImageGenerationResultProps} props - Component props.
 * @param {string} props.imageData - Generated image data URL.
 * @param {Function} props.setError - Function to set error message.
 * @param {Function} props.downloadImage - Function to download the generated image.
 * @returns {JSX.Element} Image generation result component.
 */
const ImageGenerationResult = ({
  imageData,
  setError,
  downloadImage,
}: ImageGenerationResultProps) => (
  <>
    <Grid xs={24}>
      <img
        src={imageData}
        alt="Generated activity image"
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          borderRadius: '8px',
          display: 'block',
        }}
        onLoad={() => {
          console.info('Image loaded successfully');
        }}
        onError={(e) => {
          console.error('Image load error:', e);
          setError('Failed to load the generated image. Please try again.');
        }}
      />
    </Grid>
    <Grid xs={24}>
      <Button
        onClick={() => {
          downloadImage(imageData).catch(console.error);
        }}
        type="default"
        width="100%"
        icon={<Download />}
        placeholder="Download Image"
        onPointerEnterCapture={() => undefined}
        onPointerLeaveCapture={() => undefined}
      >
        Download Image
      </Button>
    </Grid>
  </>
);

/**
 * Drawer content component.
 * @param {ContentProps} props - Component props.
 * @param {boolean} props.generatingImage - Whether the image is being generated.
 * @param {string | null} [props.imageData] - Generated image data URL.
 * @param {string | null} [props.error] - Error message if generation failed.
 * @param {Function} props.onRetry - Function to retry image generation.
 * @param {Function} props.setError - Function to set error message.
 * @param {Function} props.downloadImage - Function to download the generated image.
 * @returns {JSX.Element} Drawer content component.
 */
const Content = ({
  generatingImage,
  imageData,
  error,
  onRetry,
  setError,
  downloadImage,
}: ContentProps) => (
  <Drawer.Content>
    <Grid.Container gap={2} justify="center">
      <Grid xs={24}>
        <Card>
          <Text small type="warning">
            The activity image is being generated using an external AI service.{' '}
            <strong>AI is not a human, so it makes mistakes.</strong> Please make sure the generated
            image is appropriate before publishing it to your Strava profile.
          </Text>
        </Card>
      </Grid>
      {generatingImage ? (
        <ImageGenerationPreloader />
      ) : error ? (
        <ImageGenerationError error={error} onRetry={onRetry} />
      ) : imageData ? (
        <ImageGenerationResult
          imageData={imageData}
          setError={setError}
          downloadImage={downloadImage}
        />
      ) : null}
    </Grid.Container>
  </Drawer.Content>
);

/**
 * Image generation drawer component.
 * @param {ImageGenerationDrawerProps} props Component props.
 * @param {boolean} props.visible Whether the drawer is visible.
 * @param {boolean} props.generatingImage Whether the image is being generated.
 * @param {string | null} [props.generatedImageData] Generated image data URL.
 * @param {string | null} [props.error] Error message if generation failed.
 * @param {Function} props.setError Function to set error message.
 * @param {Function} props.onClose Function to handle drawer close.
 * @param {Function} props.onRetry Function to retry image generation.
 * @param {Function} props.downloadImage Function to download the generated image.
 * @returns {JSX.Element} Image generation drawer component.
 */
const ImageGenerationDrawer = ({
  error,
  visible,
  generatingImage,
  generatedImageData,
  onClose,
  onRetry,
  setError,
  downloadImage,
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
      downloadImage={downloadImage}
    />
  </Drawer>
);

export default ImageGenerationDrawer;
