'use client';

import Content from './Content';
import ExpandableCard from '../ExpandableCard';

interface ImageProps {
  isLoading: boolean;
  isLoaded: boolean;
  image?: string | null;
}

/**
 * Image generation progress.
 * @param {ImageProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the image is being generated.
 * @param {boolean} props.isLoaded - Whether the image has been generated successfully.
 * @param {string} [props.error] - Error message if generation failed.
 * @param {Function} props.onRetry - Function to retry image generation.
 * @param {string} [props.image] - Generated image data URL.
 * @param {Function} props.setError - Function to set error message.
 * @returns {JSX.Element} Image generation progress component.
 */
const Image = ({
  isLoading,
  isLoaded,
  image,
}: ImageProps) => (
  <ExpandableCard
    isLoading={isLoading}
    isLoaded={isLoaded}
    hasContent={Boolean(image)}
    minHeight="auto"
    title="Step 3: Creating your activity image with AI"
    pendingMessage="Pending AI image generation for your activity..."
    loadingMessage="Creating your activity image with AI..."
    errorMessage="Failed to generate image for your activity... Let's cry together."
  >
    <Content image={image} />
  </ExpandableCard>
);

export default Image;
