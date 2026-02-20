import { Activity } from 'lucide-react';

export interface PreloaderProps {
  message?: string;
  withFullHeight?: boolean;
}

/**
 * Preloader component.
 * Shows a pulsing activity icon with an optional message.
 * Keyframe animations are defined in globals.css.
 *
 * @param {PreloaderProps} props - Component props.
 * @param {string} [props.message] - Optional message to display below the loader.
 * @param {boolean} [props.withFullHeight=true] - Whether to use full viewport height.
 * @returns {JSX.Element} Preloader component.
 */
const Preloader = ({ message = undefined, withFullHeight = true }: PreloaderProps): JSX.Element => (
  <div
    className={[
      'flex flex-col items-center justify-center gap-6 w-full bg-background',
      withFullHeight ? 'min-h-[calc(100vh-60px)]' : 'py-8',
    ].join(' ')}
  >
    <div className="animate-preloader-pulse opacity-90 flex items-center justify-center">
      <Activity size={56} className="text-foreground" />
    </div>
    {message && (
      <p className="text-sm text-muted-foreground animate-preloader-fade-in text-center tracking-wide">
        {message}
      </p>
    )}
  </div>
);

export default Preloader;
