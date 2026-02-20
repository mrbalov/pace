'use client';

import { StravaActivity } from '@torq/strava-api';

import Item from './Item';

interface ActivitiesListProps {
  activities: StravaActivity[];
  onGenerateImage: (activityId: string) => void;
}

/**
 * Activities list.
 * @param {ActivitiesListProps} props - Component props.
 * @param {StravaActivity[]} props.activities - List of activities to display.
 * @param {Function} props.onGenerateImage - Function to open the activity image generation view.
 * @returns {JSX.Element[]} Activities list view.
 */
const ActivitiesList = ({ activities, onGenerateImage }: ActivitiesListProps) => (
  <div className="flex flex-wrap gap-4">
    {activities.map((activity) => (
      <Item
        key={activity.id}
        activity={activity}
        onGenerateImage={onGenerateImage}
      />
    ))}
  </div>
);

export default ActivitiesList;
