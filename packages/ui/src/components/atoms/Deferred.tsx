'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface DeferredProps {
  children: ReactNode;
  fallback?: ReactNode;
  timeout?: number;
  ready?: boolean;
}

const TIMEOUT_DEFAULT = 600;

/**
 * Defers rendering of children.
 * @param {DeferredProps} props - Component props.
 * @param {ReactNode} props.children - Children to render.
 * @param {ReactNode} [props.fallback] - Optional fallback content.
 * @param {boolean} [props.ready] - Whether the content is ready to be shown.
 * @param {number} [props.timeout] - Optional timeout in milliseconds.
 * @returns {JSX.Element | null} Deferred children.
 */
const Deferred = ({
  children,
  ready = true,
  fallback = null,
  timeout = undefined,
}: DeferredProps) => {
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (ready && !timerIdRef.current) {
      timerIdRef.current = setTimeout(() => {
        setVisible(true);
      }, timeout ?? TIMEOUT_DEFAULT);
    }

    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [ready, timeout]);

  if (visible) {
    return children;
  } else {
    return fallback;
  }
};

export default Deferred;
