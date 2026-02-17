import { Fragment, useMemo } from 'react';
import { Card, Text } from '@geist-ui/core';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import Preloader from '../../../../../components/Preloader';
import prettifySignals from './prettify-signals';

interface SignalsProps {
  isLoading: boolean;
  isLoaded: boolean;
  signals?: StravaActivitySignals | null;
}

/**
 * Strava activity signals.
 * @param {SignalsProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the signals are loading.
 * @param {boolean} props.isLoaded - Whether the signals have loaded.
 * @param {StravaActivitySignals} [props.signals] - The loaded signals.
 * @returns {JSX.Element} The signals component.
 */
const Signals = ({ isLoading, isLoaded, signals }: SignalsProps) => {
  const prettySignals = useMemo<[string, string][]>(() => {
    if (signals) {
      return prettifySignals(signals);
    } else {
      return [];
    }
  }, [signals]);

  return (
    <Card style={{ width: '100%' }}>
      {isLoading ? (
        <Preloader message="Extracting signals from your activity..." withFullHeight={false} />
      ) : (isLoaded && signals) ? (
        <>
          <Text h5 type="secondary">
            Signals extracted from your activity:
          </Text>
          <Text p type="secondary" small>
            {prettySignals.map(([key, value]) => (
              <Fragment key={key}>
                <strong>{key}:</strong> {value};{' '}
              </Fragment>
            ))}
          </Text>
        </>
      ) : (
        <Text p type="error">
          No activity signals available... Let's cry together.
        </Text>
      )}
    </Card>
  );
};

export default Signals;
