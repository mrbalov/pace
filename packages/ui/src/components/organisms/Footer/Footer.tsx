import { Github, Globe } from 'lucide-react';

import { LINKS } from './constants';

/**
 * Application footer.
 * Renders copyright notice, social links, and powered-by credits.
 * @returns {JSX.Element} Footer component.
 */
const Footer = () => (
  <footer className="flex justify-center items-center w-full py-4 border-t border-border">
    <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col gap-8">
        <span className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} TORQ by Mr.B.Lab
        </span>
        <div className="flex gap-2">
          <a
            href={LINKS.PROJECT_GITHUB}
            target="_blank"
            rel="noreferrer"
            aria-label="Go to TORQ GitHub"
            title="Go to TORQ GitHub"
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Github size={14} />
          </a>
          <a
            href={LINKS.AUTHOR_BLOG}
            target="_blank"
            rel="noreferrer"
            aria-label="Go to Mr.B. Blog"
            title="Go to Mr.B. Blog"
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Globe size={14} />
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-muted-foreground">Powered by</h4>
        <a
          href={LINKS.POLLINATIONS_AI}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted-foreground underline hover:text-foreground transition-colors w-fit"
        >
          Pollinations.AI
        </a>
        <a
          href={LINKS.NETLIFY}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted-foreground underline hover:text-foreground transition-colors w-fit"
        >
          Netlify
        </a>
        <a
          href={LINKS.CODEMIE}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted-foreground underline hover:text-foreground transition-colors w-fit"
        >
          EPAM CodeMie
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
