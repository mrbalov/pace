'use client';

import { StravaActivitySignals } from '@torq/get-strava-activity-signals';

import { Output } from './types';

/**
 * Prettifies Strava activity signals for display.
 * @param {StravaActivitySignals} signals - Raw Strava activity signals.
 * @returns {Output} Prettified signals for display.
 */
const prettifySignals = (signals: StravaActivitySignals): Output => {
  const signalsAll = {
    ...signals.core,
    ...signals.derived,
  };

  return Object.entries(signalsAll)
    .map(([key, value]) => {
      if (value) {
        const keyPretty = key
          .split(/(?=[A-Z])/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        const valueJoined = Array.isArray(value) ? value.join(', ') : value;

        return valueJoined ? [keyPretty, valueJoined] : null;
      } else {
        return null;
      }
    })
    .filter(Boolean) as Output;
};

export default prettifySignals;
