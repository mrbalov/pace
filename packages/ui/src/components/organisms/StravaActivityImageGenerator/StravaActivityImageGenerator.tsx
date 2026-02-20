'use client';

import Content from './Content';
import useGenerateImage from './useGenerateImage';

interface HeaderProps {
  isLoading: boolean;
  isLoaded: boolean;
}

interface StravaActivityImageGeneratorProps {
  activityId?: string | null;
  Header?: React.ComponentType<HeaderProps>;
}

/**
 * Strava activity image generator.
 * @param {StravaActivityImageGeneratorProps} props Component props.
 * @param {string | null} [props.activityId] ID of the activity for which the image is being generated.
 * @returns {JSX.Element} Strava activity image generator component.
 */
const StravaActivityImageGenerator = ({
  activityId,
  Header,
}: StravaActivityImageGeneratorProps) => {
  const {
    signals,
    prompt,
    image,
    isSignalsLoading,
    isPromptLoading,
    isImageLoading,
    isSignalsLoaded,
    isPromptLoaded,
    isImageLoaded,
    isLoading,
    isLoaded,
  } = useGenerateImage(activityId ?? undefined);

  return (
    <>
      {Header && <Header isLoading={isLoading} isLoaded={isLoaded} />}
      <Content
        isSignalsLoading={isSignalsLoading}
        isPromptLoading={isPromptLoading}
        isImageLoading={isImageLoading}
        isSignalsLoaded={isSignalsLoaded}
        isPromptLoaded={isPromptLoaded}
        isImageLoaded={isImageLoaded}
        signals={signals}
        prompt={prompt}
        image={image}
      />
    </>
  );
};

export default StravaActivityImageGenerator;
