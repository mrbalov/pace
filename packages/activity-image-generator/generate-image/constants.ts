/**
 * Configuration constants for image generation and DIAL API integration.
 */
export const CONFIG = {
  /** Maximum number of retry attempts. */
  MAX_RETRIES: 2,
  /** Default image quality. */
  DEFAULT_QUALITY: 'standard' as const,
  /** Default image size (1:1 aspect ratio). */
  DEFAULT_SIZE: '1024x1024' as const,
  /** Default image style. */
  DEFAULT_STYLE: 'natural' as const,
  /** Fallback styles (minimal or abstract). */
  FALLBACK_STYLES: ['minimal', 'abstract'] as const,
  /** DIAL deployment model name. */
  MODEL: 'dall-e-3',
  /** DIAL API version. */
  API_VERSION: '2024-12-01-preview',
  /** DIAL base URL. */
  BASE_URL: 'https://ai-proxy.lab.epam.com',
};
