import { useCallback, useEffect, useState } from 'react';

import { Status } from '../types';
import getUniqueArray from './getUniqueArray';
import Items from './Items';
import Expander from '../Expander';

interface StatesProps {
  status: Status;
  loadingMessage: string;
  pendingMessage: string;
  errorMessage: string;
}

/**
 * States component that displays messages based on the current status.
 * @param {StatesProps} props - Component props.
 * @param {Status} props.status - Current status of the content.
 * @param {string} props.loadingMessage - Message to display when loading.
 * @param {string} props.pendingMessage - Message to display when pending.
 * @param {string} props.errorMessage - Message to display when there's an error.
 * @returns {JSX.Element} States component.
 */
const States = ({
  status,
  loadingMessage,
  pendingMessage,
  errorMessage,
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
      setStatuses((value) => (
        getUniqueArray<Status>([...value, status]).reverse()
      ));
    }
  }, [status]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '50px',
        maxHeight: isExpanded ? '500px' : '60px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}
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
        withButton={statuses.length > 1}
      />
    </div>
  );
};

export default States;
