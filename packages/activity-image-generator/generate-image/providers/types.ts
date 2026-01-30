/**
 * Common interface for all image generation providers.
 * Generates an image from a text prompt.
 * 
 * @param {string} prompt - Text prompt for image generation.
 * @returns {Promise<string>} Promise resolving to base64-encoded image data URL (`data:image/png;base64,...`).
 * @throws {Error} Throws error if generation fails.
 */
export type ImageGenerationProvider = (prompt: string) => Promise<string>;
