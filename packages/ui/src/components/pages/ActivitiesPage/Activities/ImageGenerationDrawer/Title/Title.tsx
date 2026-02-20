'use client';

import { useMemo } from 'react';
import { X } from 'lucide-react';

import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface TitleProps {
  isLoading: boolean;
  isLoaded: boolean;
  onClose: () => void;
}

/**
 * Drawer title component.
 * @param {TitleProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the image is being generated.
 * @param {boolean} props.isLoaded - Whether the image has been generated.
 * @param {Function} props.onClose - Function to handle drawer close.
 * @returns {JSX.Element} Drawer title component.
 */
const Title = ({ isLoading, isLoaded, onClose }: TitleProps) => {
  const title = useMemo(() => {
    if (isLoading) {
      return 'AI is Generating Image...';
    } else if (isLoaded) {
      return 'AI-Generated Image';
    } else {
      return 'AI Image Generation';
    }
  }, [isLoading, isLoaded]);

  return (
    <SheetHeader className="flex flex-row items-center justify-between p-6 pb-4">
      <SheetTitle>{title}</SheetTitle>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label="Close"
        className="h-8 w-8"
      >
        <X size={16} />
      </Button>
    </SheetHeader>
  );
};

export default Title;
