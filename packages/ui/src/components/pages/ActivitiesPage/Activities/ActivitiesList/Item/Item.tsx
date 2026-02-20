'use client';

import { Activity as ActivityIcon, Navigation, Clock, TrendingUp, Zap } from 'lucide-react';
import { StravaActivity } from '@torq/strava-api';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import formatActivityType from './formatActivityType';

interface ItemProps {
  activity: StravaActivity;
  onGenerateImage: (activityId: string) => void;
}

/**
 * Activity list item.
 * @param {ItemProps} props - Component props.
 * @param {StravaActivity} props.activity - Activity to display.
 * @param {Function} props.onGenerateImage - Function to open the activity image generation view.
 * @returns {JSX.Element} Activity list item.
 */
const Item = ({ activity, onGenerateImage }: ItemProps) => (
  <div className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)]">
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="pt-6 flex-1">
        <h4 className="text-base font-semibold mb-1">{activity.name}</h4>
        <p className="text-xs text-muted-foreground mb-3">
          {formatActivityType(activity.type)}
        </p>
        <div className="flex flex-row flex-wrap gap-3 items-center">
          {activity.type && (
            <span className="text-xs flex items-center gap-1 text-muted-foreground">
              <ActivityIcon size={14} /> {formatActivityType(activity.type)}
            </span>
          )}
          {(activity?.distance ?? 0) > 0 && (
            <span className="text-xs flex items-center gap-1 text-muted-foreground">
              <Navigation size={14} /> {((activity.distance ?? 0) / 1000).toFixed(2)} km
            </span>
          )}
          {(activity?.moving_time ?? 0) > 0 && (
            <span className="text-xs flex items-center gap-1 text-muted-foreground">
              <Clock size={14} /> {Math.floor((activity.moving_time ?? 0) / 60)} min
            </span>
          )}
          {(activity?.total_elevation_gain ?? 0) > 0 && (
            <span className="text-xs flex items-center gap-1 text-muted-foreground">
              <TrendingUp size={14} /> {activity.total_elevation_gain} m
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="sm"
          onClick={() => {
            onGenerateImage(String(activity.id));
          }}
        >
          <Zap size={14} />
          Generate Image
        </Button>
      </CardFooter>
    </Card>
  </div>
);

export default Item;
