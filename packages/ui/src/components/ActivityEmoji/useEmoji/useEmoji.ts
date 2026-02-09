import { useEffect, useRef, useState } from 'react';

import {
  EMOJI_ANIMATION_TIMEOUT,
  EMOJI_ANIMATION_TIMEOUT_HALF,
  EMOJIS,
} from './constants';

interface Output {
  emoji: string;
  isEmojiAnimating: boolean;
}

/**
 * Manages an animated activity emoji.
 * @returns {Output} Emoji and its animation state.
 */
const useEmoji = (): Output => {
  const [activeEmojiIndex, setActiveEmojiIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setIsAnimating(true);
      timeoutIdRef.current = setTimeout(() => {
        setActiveEmojiIndex(
          (prevIndex: number) => {
            const nextIndex: number = Math.floor(Math.random() * EMOJIS.length);

            return nextIndex === prevIndex
              ? ((nextIndex + 1) % EMOJIS.length)
              : nextIndex;
          },
        );
        setIsAnimating(false);
      }, EMOJI_ANIMATION_TIMEOUT_HALF);
    }, EMOJI_ANIMATION_TIMEOUT);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, []);

  return {
    emoji: EMOJIS[activeEmojiIndex],
    isEmojiAnimating: isAnimating,
  };
};

export default useEmoji;
