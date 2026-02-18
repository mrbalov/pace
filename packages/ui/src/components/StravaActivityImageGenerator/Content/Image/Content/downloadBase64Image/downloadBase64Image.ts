/**
 * Downloads the base64 image.
 * Converts base64 data URL to blob and triggers a download.
 * @param {string} image - Base64-encoded image data URL.
 * @returns {Promise<void>} Promise that resolves when download is triggered.
 */
const downloadBase64Image = async (image: string): Promise<void> => {
  const hasImage = image && image.trim().length > 0;

  if (hasImage) {
    try {
      // Convert data URL to blob.
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'activity-image.png';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  } else {
    console.error('Failed to download image: Empty or invalid image data');
  }
};

export default downloadBase64Image
