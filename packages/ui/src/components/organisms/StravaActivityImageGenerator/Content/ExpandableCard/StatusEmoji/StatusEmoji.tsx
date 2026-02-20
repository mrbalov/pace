'use client';

import { Status } from '../types';
import getStatusEmoji from './getStatusEmoji';

interface StatusEmojiProps {
  status: Status;
}

/**
 * Status emoji.
 * @param {StatusEmojiProps} props - Component props.
 * @param {Status} props.status - The current status of the content.
 * @returns {JSX.Element | string} Status emoji.
 */
const StatusEmoji = ({ status }: StatusEmojiProps) => {
  const { emoji, animation } = getStatusEmoji(status);

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          @keyframes flip {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(180deg); }
          }
        `}
      </style>
      <span style={{ display: 'inline-block', animation }}>
        {emoji}
      </span>
    </>
  )
};

export default StatusEmoji;
