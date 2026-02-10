import useEmoji, { EMOJI_ANIMATION_TIMEOUT_HALF } from './useEmoji';

/**
 * Interactive activity emoji component.
 * Changes emoji every 5 seconds with smooth fade and scale animation.
 * Cycles through comprehensive list of sport activities with skin tone variations.
 * @returns {JSX.Element} Interactive activity emoji component with rotation animation.
 */
const ActivityEmoji = (): JSX.Element => {
  const { emoji, isEmojiAnimating } = useEmoji();

  return (
    <>
      <style>
        {`
          @keyframes emojiTransition {
            0% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 0.3;
              transform: scale(0.8) rotate(5deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }
          
          .activity-emoji {
            display: inline-block;
            font-size: 1.2em;
            transition: all 0.4s ease-in-out;
            animation: ${isEmojiAnimating ? `emojiTransition ${EMOJI_ANIMATION_TIMEOUT_HALF}ms ease-in-out` : 'none'};
          }
        `}
      </style>
      <span
        className="activity-emoji"
        role="img"
        aria-label={`Activity emoji: ${emoji}`}
        title="Rotating sport activity emoji"
      >
        {emoji}
      </span>
    </>
  );
};

export default ActivityEmoji;
