'use client';

import { StravaActivitySignals } from '@torq/get-strava-activity-signals';

import Prompt from './Prompt';
import Signals from './Signals';
import Image from './Image';

interface ContentProps {
  isSignalsLoading: boolean;
  isPromptLoading: boolean;
  isImageLoading: boolean;
  isSignalsLoaded: boolean;
  isPromptLoaded: boolean;
  isImageLoaded: boolean;
  signals?: StravaActivitySignals | null;
  prompt?: string | null;
  image?: string | null;
}

/**
 * Image generation content.
 * Replaced Geist Drawer.Content/Grid/Card with a scrollable div + Tailwind grid.
 * @param {ContentProps} props - Component props.
 * @returns {JSX.Element} Image generation content component.
 */
const Content = ({
  isSignalsLoading,
  isPromptLoading,
  isImageLoading,
  isSignalsLoaded,
  isPromptLoaded,
  isImageLoaded,
  signals,
  prompt,
  image,
}: ContentProps) => (
  <div className="flex flex-col gap-4 p-6 pt-2">
    <div className="rounded-lg border bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 p-3">
      <p className="text-xs text-amber-800 dark:text-amber-300">
        The activity image is being generated using an external AI service.{' '}
        <strong>AI is not a human, so it makes mistakes.</strong> Please make sure the generated
        image is appropriate before publishing it to your Strava profile.
      </p>
    </div>
    <Signals
      isLoading={isSignalsLoading}
      isLoaded={isSignalsLoaded}
      signals={signals}
    />
    <Prompt
      isLoading={isPromptLoading}
      isLoaded={isPromptLoaded}
      prompt={prompt}
    />
    <Image
      isLoading={isImageLoading}
      isLoaded={isImageLoaded}
      image={image}
    />
  </div>
);

export default Content;
