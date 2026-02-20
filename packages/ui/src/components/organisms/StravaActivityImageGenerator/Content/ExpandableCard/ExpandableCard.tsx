'use client';

import { useCallback, useMemo, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import getStatus from './getStatus';
import State from './States';
import Title from './Title';
import Expander from './Expander';
import { cn } from '@/lib/utils';

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
  const rootClassList = cn(
    'relative w-full overflow-hidden',
    'transition-[max-height] duration-300 ease-in-out',
    `min-h-[${minHeight}] max-h-[${minHeight}]`,
    {
      'pb-[10px] cursor-pointer': withExpander,
      'cursor-default': !withExpander
    },
  );
  const style = useMemo(() => ({
    maxHeight: isExpanded ? '800px' : minHeight,
  }), [isExpanded, minHeight]);

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
      className={rootClassList}
      style={style}
      onClick={handleToggleExpand}
    >
      <CardContent className="pt-4">
        <Title status={status}>{title}</Title>
        <State
          status={status}
          pendingMessage={pendingMessage}
          loadingMessage={loadingMessage}
          errorMessage={errorMessage}
        />
        <Separator className="my-2" />
        {children}
      </CardContent>
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
