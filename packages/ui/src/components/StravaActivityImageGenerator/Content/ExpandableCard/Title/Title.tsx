import { Text } from '@geist-ui/core';

import StatusEmoji from '../States/StatusEmoji';
import StatusText from '../States/StatusText';
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
  <Text h5 type="secondary">
    <StatusEmoji status={status} />
    {' '}
    {children}
    {' '}
    (<StatusText status={status} />)
  </Text>
);

export default Title;
