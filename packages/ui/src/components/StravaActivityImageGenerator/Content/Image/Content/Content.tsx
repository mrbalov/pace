import { Download } from '@geist-ui/icons';
import { Button, useTheme } from '@geist-ui/core';

import downloadBase64Image from './downloadBase64Image';

interface ContentProps {
  image?: string | null;
}

/**
 * Image generation content.
 * @param {ContentProps} props - Component props.
 * @param {string} props.image - Generated image data URL.
 * @returns {JSX.Element} Image generation content component.
 */
const Content = ({
  image,
}: ContentProps) => {
  const theme = useTheme();

  return (
    <>
      <div
        style={{
          aspectRatio: '1/1',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '100%',
          backgroundColor: theme.palette.accents_2,
          marginBottom: '16px',
        }}
      >
        {image && (
          <img
            src={image}
            alt="Generated activity image"
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
              borderRadius: '8px',
              display: 'block',
            }}
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
        type="default"
        width="100%"
        icon={<Download />}
        placeholder="Download Image"
        onPointerEnterCapture={() => undefined}
        onPointerLeaveCapture={() => undefined}
        disabled={!image}
      >
        Download Image
      </Button>
    </>
  );
};

export default Content;
