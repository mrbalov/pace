/**
 * Retry function type for handleRetry.
 */
export type RetryFunction<T> = () => Promise<T>;
