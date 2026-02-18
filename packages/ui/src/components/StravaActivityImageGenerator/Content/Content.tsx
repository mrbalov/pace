import { Text, Drawer, Card, Grid } from '@geist-ui/core';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

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
 * @param {ContentProps} props - Component props.
 * @param {boolean} props.isSignalsLoading - Whether the activity signals are being loaded.
 * @param {boolean} props.isPromptLoading - Whether the image prompt is being generated.
 * @param {boolean} props.isImageLoading - Whether the image is being generated.
 * @param {boolean} props.isSignalsLoaded - Whether the activity signals have been loaded.
 * @param {boolean} props.isPromptLoaded - Whether the image prompt has been generated.
 * @param {boolean} props.isImageLoaded - Whether the image has been generated.
 * @param {StravaActivitySignals | null} [props.signals] - Loaded activity signals.
 * @param {string | null} [props.prompt] - Generated image prompt.
 * @param {string | null} [props.image] - Generated image (base64).
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
        <Signals
          isLoading={isSignalsLoading}
          isLoaded={isSignalsLoaded}
          signals={signals}
        />
      </Grid>
      <Grid xs={24}>
        <Prompt
          isLoading={isPromptLoading}
          isLoaded={isPromptLoaded}
          prompt={prompt}
        />
      </Grid>
      <Grid xs={24}>
        <Image
          isLoading={isImageLoading}
          isLoaded={isImageLoaded}
          image={image}
        />
      </Grid>
    </Grid.Container>
  </Drawer.Content>
);

export default Content;
