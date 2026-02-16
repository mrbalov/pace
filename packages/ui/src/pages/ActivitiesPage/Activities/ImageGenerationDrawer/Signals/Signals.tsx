import { Card, Text } from '@geist-ui/core';
import { StravaActivitySignals } from '@pace/get-strava-activity-signals';

import Preloader from '../../../../../components/Preloader';
import { Fragment, useMemo } from 'react';

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
  const signalsFlat = useMemo<[string, string][]>(() => {
    if (signals) {
      const signalsAll = {
        ...signals.core,
        ...signals.derived,
      };

      return Object.entries(signalsAll)
        .map(([key, value]) => {
          if (value) {
            const keyPretty = key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const valueJoined = Array.isArray(value) ? value.join(', ') : value;

            return [
              keyPretty,
              valueJoined,
            ];
          } else {
            return null;
          }
        })
        .filter(Boolean) as [string, string][];
    } else {
      return [];
    }
  }, [signals]);

  return (
    <Card
      style={{
        width: '100%',
        height: '250px',
        overflow: 'auto',
      }}
    >
      <Card.Content>
        {isLoading ? (
          <Preloader
            message="Extracting signals from your activity..."
            withFullHeight={false}
          />
        ) : (isLoaded && signals) ? (
          <>
            <Text h5 type="secondary">
              Signals extracted from your activity:
            </Text>
            <Text p type="secondary" small>
              {signalsFlat.map(([key, value]) => (
                <Fragment key={key}>
                  <strong>{key}:</strong>
                  {' '}
                  {value}
                  ;
                  {' '}
                </Fragment>
              ))}
            </Text>
          </>
        ) : (
          <Text p type="error">No activity signals available... Let's cry together.</Text>
        )}
      </Card.Content>
    </Card>
  );
};

export default Signals;
