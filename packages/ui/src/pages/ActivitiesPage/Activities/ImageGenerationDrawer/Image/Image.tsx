import { useCallback } from 'react';
import { Download } from '@geist-ui/icons';
import { Button, Text, Spacer, Note, Grid, Card } from '@geist-ui/core';

import Preloader from '../../../../../components/Preloader';

interface ImageProps {
  isLoading: boolean;
  onRetry: () => void;
  imageData?: string | null;
  setError: (error: string) => void;
  error?: string | null;
}

interface ImageErrorProps {
  error: string;
  onRetry: () => void;
}

interface ImageContentProps {
  imageData: string;
  setError: (error: string) => void;
}

/**
 * Image error.
 * @param {ImageErrorProps} props - Component props.
 * @param {string} props.error - Error message to display.
 * @param {Function} props.onRetry - Function to retry image generation.
 * @returns {JSX.Element} Image error component.
 */
const ImageError = ({ error, onRetry }: ImageErrorProps) => (
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
 * Image generation result.
 * @param {ImageContentProps} props - Component props.
 * @param {string} props.imageData - Generated image data URL.
 * @param {Function} props.setError - Function to set error message.
 * @param {Function} props.downloadImage - Function to download the generated image.
 * @returns {JSX.Element} Image generation result component.
 */
const ImageContent = ({
  imageData,
  setError,
}: ImageContentProps) => {
  /**
   * Downloads the base64 image.
   * Converts base64 data URL to blob and triggers a download.
   * @param {string} imageData - Base64-encoded image data URL.
   * @returns {Promise<void>} Promise that resolves when download is triggered.
   */
  const downloadImage = useCallback(async (imageData: string): Promise<void> => {
    try {
      // Convert data URL to blob.
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
      setError('Failed to download image. Please try again.');
    }
  }, []);

  return (
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
};

/**
 * Image generation progress.
 * @param {ImageProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the image is being generated.
 * @param {string} [props.error] - Error message if generation failed.
 * @param {Function} props.onRetry - Function to retry image generation.
 * @param {string} [props.imageData] - Generated image data URL.
 * @param {Function} props.setError - Function to set error message.
 * @returns {JSX.Element} Image generation progress component.
 */
const Image = ({
  isLoading,
  error,
  onRetry,
  imageData,
  setError,
}: ImageProps) => (
  <Card style={{ width: '100%' }}>
    {isLoading ? (
      <Preloader message="Creating your activity image..." withFullHeight={false} />
    ) : error ? (
      <ImageError error={error} onRetry={onRetry} />
    ) : imageData ? (
      <ImageContent imageData={imageData} setError={setError} />
    ) : null}
  </Card>
);

export default Image;
