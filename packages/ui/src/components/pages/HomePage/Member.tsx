import Link from 'next/link';
import { Activity } from 'lucide-react';

/**
 * Member view.
 * No hooks or browser APIs — pure presentational content.
 * @returns {JSX.Element} Member view.
 */
const Member = () => (
  <div className="flex flex-col items-center justify-center gap-8 text-center">
    <h1 className="text-4xl font-bold text-primary">
      Welcome to TORQ!
    </h1>
    <p className="text-lg font-bold leading-relaxed text-muted-foreground max-w-xl">
      You&apos;re successfully connected to Strava. Review your activities and generate beautiful AI
      images for them!
    </p>
    <Link
      href="/activities"
      className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <Activity size={16} />
      View Activities
    </Link>
  </div>
);

export default Member;
