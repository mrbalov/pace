import { Button, Grid, Link, Text, useTheme } from '@geist-ui/core';
import { Github, Globe } from '@geist-ui/icons';

import { LINKS } from '../../constants';

/**
 * Application footer component.
 * @returns {JSX.Element} Footer component
 */
const Footer = () => {
  const theme = useTheme();

  return (
    <footer
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '16px 0',
        borderTop: `1px solid ${theme.palette.border}`,
      }}
    >
      <Grid.Container gap={2}>
        <Grid
          xs={12}
          md={6}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          <Text span type="secondary">
            © {new Date().getFullYear()} PACE by Mr.B.
          </Text>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href={LINKS.PROJECT_GITHUB}
              type="secondary"
              target="_blank"
              onPointerEnterCapture={() => undefined}
              onPointerLeaveCapture={() => undefined}
              placeholder="Go to PACE GitHub"
            >
              <Button
                auto
                type="default"
                scale={0.6}
                icon={<Github />}
                aria-label="Go to PACE GitHub"
                title="Go to PACE GitHub"
                placeholder="Go to PACE GitHub"
                onPointerEnterCapture={() => undefined}
                onPointerLeaveCapture={() => undefined}
              />
            </Link>
            <Link
              href={LINKS.AUTHOR_BLOG}
              type="secondary"
              target="_blank"
              onPointerEnterCapture={() => undefined}
              onPointerLeaveCapture={() => undefined}
              placeholder="Go to Mr.B. Blog"
            >
              <Button
                auto
                type="default"
                scale={0.6}
                icon={<Globe />}
                aria-label="Go to Mr.B. Blog"
                title="Go to Mr.B. Blog"
                placeholder="Go to Mr.B. Blog"
                onPointerEnterCapture={() => undefined}
                onPointerLeaveCapture={() => undefined}
              />
            </Link>
          </div>
        </Grid>
        <Grid
          xs={12}
          md={6}
          style={{
            display: 'flex',
            gap: '8px',
            flexDirection: 'column',
          }}
        >
          <Text h4 type="secondary">
            Powered by
          </Text>
          <Link
            href={LINKS.POLLINATIONS_AI}
            type="secondary"
            target="_blank"
            onPointerEnterCapture={() => undefined}
            onPointerLeaveCapture={() => undefined}
            placeholder="Go to Pollinations AI"
            style={{
              textDecoration: 'underline dotted',
            }}
          >
            <Text span small>
              Pollinations.AI
            </Text>
          </Link>
          <Link
            href={LINKS.NETLIFY}
            type="secondary"
            target="_blank"
            onPointerEnterCapture={() => undefined}
            onPointerLeaveCapture={() => undefined}
            placeholder="Go to Netlify"
            style={{
              textDecoration: 'underline dotted',
            }}
          >
            <Text span small>
              Netlify
            </Text>
          </Link>
          <Link
            href={LINKS.CODEMIE}
            type="secondary"
            target="_blank"
            onPointerEnterCapture={() => undefined}
            onPointerLeaveCapture={() => undefined}
            placeholder="Go to EPAM CodeMie"
            style={{
              textDecoration: 'underline dotted',
            }}
          >
            <Text span small>
              EPAM CodeMie
            </Text>
          </Link>
        </Grid>
      </Grid.Container>
    </footer>
  );
};

export default Footer;
