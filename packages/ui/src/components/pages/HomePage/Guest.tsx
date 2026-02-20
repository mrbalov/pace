'use client';

import { Activity } from 'lucide-react';

import { authorizeStrava } from '@/api/strava';
import { Button } from '@/components/ui/button';

/**
 * Guest view.
 * Requires 'use client' because authorizeStrava uses window.location.href.
 * @returns {JSX.Element} Guest view.
 */
const Guest = () => (
  <div className="flex flex-col items-center justify-center gap-8 text-center">
    <h1 className="text-4xl font-bold text-primary">
      Welcome to TORQ!
    </h1>
    <p className="text-lg font-bold leading-relaxed text-muted-foreground max-w-xl">
      <strong>TORQ</strong> is a{' '}
      <span className="font-bold text-primary" style={{ letterSpacing: '0.3px' }}>
        Training Orbit Research Qernel
      </span>
      . It helps you create beautiful visualizations of your athletic activities. Connect your
      Strava account to get started and transform your workout data into stunning images!
    </p>
    <Button onClick={authorizeStrava} variant="outline">
      <Activity />
      Authorize with Strava
    </Button>
  </div>
);

export default Guest;
