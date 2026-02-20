'use client';

import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

import downloadBase64Image from './downloadBase64Image';

interface ContentProps {
  image?: string | null;
}

/**
 * Image generation content.
 * Displays the generated image and a download button.
 * @param {ContentProps} props - Component props.
 * @param {string | null} [props.image] - Generated image data URL (base64).
 * @returns {JSX.Element} Image generation content component.
 */
const Content = ({ image }: ContentProps) => (
  <>
    <div className="aspect-square w-full rounded-lg bg-muted mb-4 overflow-hidden">
      {image && (
        <img
          src={image}
          alt="Generated activity image"
          className="w-full h-auto block rounded-lg"
          onLoad={() => {
            console.info('Image loaded successfully');
          }}
          onError={(error) => {
            console.error('Image load error:', error);
          }}
        />
      )}
    </div>
    <Button
      onClick={() => {
        if (image) {
          downloadBase64Image(image).catch(console.error);
        }
      }}
      variant="outline"
      className="w-full"
      disabled={!image}
    >
      <Download size={16} />
      Download Image
    </Button>
  </>
);

export default Content;
