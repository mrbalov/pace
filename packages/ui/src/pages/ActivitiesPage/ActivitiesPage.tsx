import { useActivities } from '../../api/hooks';
import Preloader from '../../components/Preloader';
import Activities from './Activities';
import Guest from './Guest';
import Error from './Error';
import Deferred from '../../components/Deferred';

/**
 * Activities page component for listing Strava activities.
 * Shows activities with error handling and loading states.
 *
 * @returns {JSX.Element} Activities page component
 */
const ActivitiesPage = (): JSX.Element => {
  const { activities, loading, error, isUnauthorized, refetch } = useActivities();

  return (
    <Deferred ready={!loading} fallback={<Preloader message="Loading your activities..." />}>
      {(() => {
        if (isUnauthorized) {
          return <Guest />;
        } else if (error) {
          return <Error error={error} refetchActivities={refetch} />;
        } else {
          return <Activities activities={activities ?? []} />;
        }
      })()}
    </Deferred>
  );
};

export default ActivitiesPage;
