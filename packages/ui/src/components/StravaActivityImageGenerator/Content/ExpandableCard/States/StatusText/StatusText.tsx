import { Status } from '../../types';

interface StatusEmojiProps {
  status: Status;
}

/**
 * Status emoji.
 * @param {StatusEmojiProps} props - Component props.
 * @param {Status} props.status - The current status of the content.
 * @returns {JSX.Element | string} Status emoji.
 */
const StatusText = ({ status }: StatusEmojiProps) => {
  switch (status) {
    case 'loading': {
      return 'Processing';
    }
    case 'loaded': {
      return 'Done';
    }
    case 'error': {
      return 'Error';
    }
    case 'pending': {
      return 'Pending';
    }
    default: {
      return 'Pending';
    }
  }
};

export default StatusText;
