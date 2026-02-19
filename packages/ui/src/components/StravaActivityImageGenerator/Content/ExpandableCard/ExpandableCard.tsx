import { useCallback, useState } from 'react';
import { Card, Divider } from '@geist-ui/core';

import getStatus from './getStatus';
import State from './States';
import Title from './Title';
import Expander from './Expander';

interface ExpandableCardProps {
  isLoading: boolean;
  isLoaded: boolean;
  hasContent: boolean;
  children?: React.ReactNode;
  loadingMessage?: string;
  pendingMessage?: string;
  errorMessage?: string;
  title?: string;
  minHeight?: string;
  withExpander?: boolean;
}

/**
 * Expandable card.
 * @param {ExpandableCardProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the content is loading.
 * @param {boolean} props.isLoaded - Whether the content has been loaded.
 * @param {boolean} props.hasContent - Whether the content has meaningful data.
 * @param {React.ReactNode} [props.children] - The content to display inside the card.
 * @param {string} [props.loadingMessage] - Custom loading message to display while loading.
 * @param {string} [props.pendingMessage] - Custom pending message to display while waiting.
 * @param {string} [props.errorMessage] - Custom error message to display if loading fails.
 * @param {string} [props.title] - Custom title to display when content is successfully loaded.
 * @param {string} [props.minHeight] - Minimum height of the card.
 * @param {boolean} [props.withExpander] - Whether to display an expander button for the card.
 * @returns {JSX.Element} The expandable card component.
 */
const ExpandableCard = ({
  isLoading,
  isLoaded,
  hasContent,
  children = null,
  loadingMessage = 'Loading...',
  pendingMessage = 'Pending...',
  errorMessage = 'Someting went wrong...',
  title = 'Content',
  minHeight = '60px',
  withExpander = false,
}: ExpandableCardProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const status = getStatus({ hasContent, isLoading, isLoaded });

  /**
   * Toggles the expanded state of the card.
   * @returns {void}
   */
  const handleToggleExpand = useCallback((event: React.MouseEvent) => {
    if (withExpander) {
      event.stopPropagation();
      setIsExpanded((prev) => !prev);
    }
  }, [withExpander]);

  return (
    <Card
      style={{
        position: 'relative',
        width: '100%',
        minHeight: minHeight,
        maxHeight: isExpanded ? '800px' : minHeight,
        overflow: 'hidden',
        paddingBottom: withExpander ? '10px' : 0,
        cursor: withExpander ? 'pointer' : 'default',
        transition: 'max-height 0.3s ease',
      }}
      onClick={handleToggleExpand}
      hoverable
    >
      <Card.Content>
        <Title status={status}>{title}</Title>
        <State
          status={status}
          pendingMessage={pendingMessage}
          loadingMessage={loadingMessage}
          errorMessage={errorMessage}
        />
        <Divider marginTop={0} paddingTop={0} />
        {children}
      </Card.Content>
      {withExpander && (
        <Expander
          isExpanded={isExpanded}
          withButton={status === 'loaded'}
          handleToggleExpand={handleToggleExpand}
        />
      )}
    </Card>
  );
};

export default ExpandableCard;
