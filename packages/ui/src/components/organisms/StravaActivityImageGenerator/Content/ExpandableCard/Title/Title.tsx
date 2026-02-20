'use client';

import StatusEmoji from '../StatusEmoji';
import StatusText from '../StatusText';
import { Status } from '../types';

interface TitleProps {
  status: Status;
  children: string;
}

/**
 * Title component for the expandable card, displaying the status and title.
 * @param {TitleProps} props - Component props.
 * @param {Status} props.status - Current status of the content.
 * @param {string} props.children - Title to display when content is successfully loaded.
 * @returns {JSX.Element} Title component for the expandable card.
 */
const Title = ({ status, children }: TitleProps) => (
  <h5 className="text-sm font-medium text-muted-foreground mb-1">
    <StatusEmoji status={status} />
    {' '}
    {children}
    {' '}
    (<StatusText status={status} />)
  </h5>
);

export default Title;
