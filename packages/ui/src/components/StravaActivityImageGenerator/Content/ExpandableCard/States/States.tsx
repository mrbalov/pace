import { useCallback, useEffect, useState } from 'react';
import { Card } from '@geist-ui/core';

import { Status } from '../types';
import getUniqueArray from './getUniqueArray';
import Items from './Items';
import Expander from '../Expander';

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
    <Card
      style={{
        position: 'relative',
        width: '100%',
        minHeight: minHeight,
        maxHeight: isExpanded ? '500px' : minHeight,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
        cursor: statuses.length > 0 ? 'pointer' : 'default',
        margin: '16px 0',
      }}
      onClick={handleToggleExpand}
      hoverable={statuses.length > 0}
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
    </Card>
  );
};

export default States;
