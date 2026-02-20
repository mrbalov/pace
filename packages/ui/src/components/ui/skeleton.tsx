import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Loading skeleton placeholder.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Component props.
 * @returns {JSX.Element} Skeleton component.
 */
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
);

export { Skeleton };
