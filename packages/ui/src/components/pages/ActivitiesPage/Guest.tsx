import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

/**
 * Guest view.
 * No hooks or browser APIs — pure presentational content.
 * @returns {JSX.Element} Guest view.
 */
const Guest = () => (
  <div className="flex justify-center">
    <div className="w-full max-w-lg">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please connect your Strava account to view your activities.
          </p>
        </CardContent>
        <CardFooter>
          <Link
            href="/"
            className="inline-flex items-center gap-2 w-full justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Go to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  </div>
);

export default Guest;
