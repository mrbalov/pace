import { Grid, Loading, Text, useTheme } from '@geist-ui/core';
import { Activity as ActivityIcon } from '@geist-ui/icons';

export interface PreloaderProps {
  message?: string;
  withFullHeight?: boolean;
}

/**
 * Preloader component with smooth animations and consistent layout.
 * Prevents UI jumping by maintaining consistent dimensions.
 *
 * @param {PreloaderProps} props - Component props.
 * @param {string} [props.message] - Optional message to display below the loader.
 * @param {boolean} [props.withFullHeight=true] - Whether to use full viewport height.
 * @returns {JSX.Element} Preloader component
 */
const Preloader = ({ 
  message = undefined,
  withFullHeight = true,
}: PreloaderProps): JSX.Element => {
  const theme = useTheme();

  return (
    <>
      <Grid.Container
        gap={2}
        justify='center'
        style={{ 
          minHeight: withFullHeight ? 'calc(100vh - 60px)' : 'auto',
          alignContent: 'center',
          padding: '2rem',
          opacity: 1,
          transition: 'opacity 0.3s ease-out',
          position: 'relative',
          backgroundColor: theme.palette.background,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid
          xs={24}
          sm={20}
          md={16}
          lg={12}
          style={{
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              padding: '3rem 2rem',
              width: '100%',
            }}
          >
            <div
              style={{
                animation: 'preloaderPulse 2s ease-in-out infinite',
                opacity: 0.9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIcon size={56} />
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
            }}>
              <Loading scale={2} />
              {message && (
                <Text
                  type='secondary'
                  style={{
                    fontSize: '0.875rem',
                    animation: 'preloaderFadeIn 0.6s ease-in',
                    letterSpacing: '0.01em',
                    textAlign: 'center',
                  }}
                >
                  {message}
                </Text>
              )}
            </div>
          </div>
        </Grid>
      </Grid.Container>
      <style>{`
        @keyframes preloaderPulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.08) rotate(5deg);
          }
        }
        @keyframes preloaderFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Preloader;
