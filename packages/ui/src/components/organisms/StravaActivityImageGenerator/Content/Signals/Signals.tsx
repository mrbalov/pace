'use client';

import { Fragment, useMemo } from 'react';
import { StravaActivitySignals } from '@torq/get-strava-activity-signals';

import prettifySignals from './prettifySignals';
import ExpandableCard from '../ExpandableCard';

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
  const prettySignals = useMemo<[string, string][] | null>(() => (
    signals ? prettifySignals(signals) : null
  ), [signals]);

  return (
    <ExpandableCard
      isLoading={isLoading}
      isLoaded={isLoaded}
      hasContent={(prettySignals?.length ?? 0) > 0}
      title="Step 1: Extracting AI signals from your activity"
      pendingMessage="Pending AI signals extraction..."
      loadingMessage="Extracting AI signals..."
      errorMessage="No activity signals available..."
      withExpander
    >
      {prettySignals && (
        <p className="text-sm text-muted-foreground">
          {prettySignals?.map(([key, value]) => (
            <Fragment key={key}>
              <strong>{key}:</strong> {value};{' '}
            </Fragment>
          ))}
        </p>
      )}
    </ExpandableCard>
  );
};

export default Signals;
