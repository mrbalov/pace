'use client';

import ExpandableCard from '../ExpandableCard';

interface PromptProps {
  isLoading: boolean;
  isLoaded: boolean;
  prompt?: string | null;
}

/**
 * Image generation prompt.
 * @param {PromptProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the prompt is being generated.
 * @param {boolean} props.isLoaded - Whether the prompt has been loaded.
 * @param {string | null} [props.prompt] - Generated prompt text.
 * @returns {JSX.Element} The prompt component.
 */
const Prompt = ({
  isLoading,
  isLoaded,
  prompt,
}: PromptProps) => (
  <ExpandableCard
    isLoading={isLoading}
    isLoaded={isLoaded}
    hasContent={Boolean(prompt)}
    loadingMessage="Preparing AI image generation prompt for your activity..."
    errorMessage="No AI image generation prompt available... Let's cry together."
    pendingMessage="Pending AI image generation prompt preparation for your activity..."
    title="Step 2: Preparing AI image generation prompt for your activity"
    withExpander
  >
    <p className="text-sm text-muted-foreground">
      {prompt}
    </p>
  </ExpandableCard>
);

export default Prompt;
