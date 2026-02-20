'use client';

import { Status } from '../../types';

interface ItemProps {
  status: Status;
  index: number;
  loadingMessage: string;
  pendingMessage: string;
  errorMessage: string;
}

interface ItemsProps {
  statuses: Status[];
  loadingMessage: string;
  pendingMessage: string;
  errorMessage: string;
}

/**
 * States item based on the current status.
 * @param {ItemProps} props - Component props.
 * @param {Status} props.status - Current status of the content.
 * @param {number} props.index - Index of the status in the list of statuses.
 * @param {string} props.loadingMessage - Message to display when loading.
 * @param {string} props.pendingMessage - Message to display when pending.
 * @param {string} props.errorMessage - Message to display when there's an error.
 * @returns {JSX.Element} State item component.
 */
const Item = ({
  status,
  index,
  loadingMessage,
  pendingMessage,
  errorMessage,
}: ItemProps) => {
  switch (status) {
    case 'pending': {
      return `${index}. ${pendingMessage}`;
    }
    case 'loading': {
      return `${index}. ${loadingMessage}`;
    }
    case 'error': {
      return `${index}. ${errorMessage}`;
    }
    default: {
      return `${index}. Done!`;
    }
  }
};

/**
 * Status items.
 * @param {ItemsProps} props - Component props.
 * @param {Status[]} props.statuses - List of current statuses.
 * @param {string} props.loadingMessage - Message to display when loading.
 * @param {string} props.pendingMessage - Message to display when pending.
 * @param {string} props.errorMessage - Message to display when there's an error.
 * @returns {JSX.Element} Status items component.
 */
const Items = ({
  statuses,
  loadingMessage,
  pendingMessage,
  errorMessage,
}: ItemsProps) => (
  <p className="text-sm text-muted-foreground">
    {statuses.map((status, index) => (
      <span key={status} className="block">
        <Item
          index={index + 1}
          status={status}
          loadingMessage={loadingMessage}
          pendingMessage={pendingMessage}
          errorMessage={errorMessage}
        />
      </span>
    ))}
  </p>
);

export default Items;
