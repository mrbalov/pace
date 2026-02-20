'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: string;
  refetchActivities: () => void;
}

/**
 * Error view.
 * Requires 'use client' because refetchActivities is a callback prop.
 * @param {ErrorProps} props - Component props.
 * @param {string} props.error - Error message to display.
 * @param {Function} props.refetchActivities - Function to refetch activities on retry.
 * @returns {JSX.Element} Error view.
 */
const Error = ({ error, refetchActivities }: ErrorProps) => (
  <div className="flex justify-center">
    <div className="w-full max-w-lg">
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
              <p className="mt-2 text-sm opacity-80">
                We encountered an issue while fetching your activities. Please try again.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={refetchActivities} className="w-full" variant="outline">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
);

export default Error;
