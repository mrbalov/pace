import { StravaActivitySignals } from '@torq/get-strava-activity-signals';

export interface Input {
  activityId: string;
  activitySignals: StravaActivitySignals;
}

export type Response = {
  prompt?: string;
};
