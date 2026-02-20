'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Status } from '../types';
import getUniqueArray from './getUniqueArray';
import Items from './Items';
import Expander from '../Expander';
import { cn } from '@/lib/utils';

interface StatesProps {
  status: Status;
  loadingMessage: string;
  pendingMessage: string;
  errorMessage: string;
  minHeight?: string;
}

/**
 * States component that displays messages based on the current status.
 * @param {StatesProps} props - Component props.
 * @param {Status} props.status - Current status of the content.
 * @param {string} props.loadingMessage - Message to display when loading.
 * @param {string} props.pendingMessage - Message to display when pending.
 * @param {string} props.errorMessage - Message to display when there's an error.
 * @param {string} [props.minHeight] - Minimum height of the states container.
 * @returns {JSX.Element} States component.
 */
const States = ({
  status,
  loadingMessage,
  pendingMessage,
  errorMessage,
  minHeight = '50px',
}: StatesProps) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const hasStatuses = statuses.length > 0;
  const rootClassList = cn(
    'relative w-full overflow-hidden',
    'transition-[max-height] duration-300 ease-in-out',
    `min-h-[${minHeight}] max-h-[${minHeight}]`,
    {
      'cursor-pointer': hasStatuses,
      'cursor-default': !hasStatuses,
    },
  );
  const style = useMemo(() => ({
    minHeight: minHeight,
    maxHeight: isExpanded ? '500px' : minHeight,
  }), [minHeight, isExpanded]);

  const handleToggleExpand = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setIsExpanded((value) => !value);
  }, []);

  useEffect(() => {
    const isUniqueStatus = !statuses.includes(status);

    if (isUniqueStatus) {
      setStatuses((value) => getUniqueArray<Status>([...value, status]));
    }
  }, [status]);

  return (
    <div
      style={style}
      className={rootClassList}
      onClick={handleToggleExpand}
    >
      <Items
        statuses={statuses}
        loadingMessage={loadingMessage}
        pendingMessage={pendingMessage}
        errorMessage={errorMessage}
      />
      <Expander
        isExpanded={isExpanded}
        handleToggleExpand={handleToggleExpand}
        withButton={statuses.length > 0}
      />
    </div>
  );
};

export default States;
