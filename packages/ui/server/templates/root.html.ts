import { baseTemplate } from './index';

/**
 * Generates root page HTML template.
 *
 * @returns {string} Complete HTML document string
 */
const rootTemplate = (): string => {
  const content = `
    <main class="container">
      <header>
        <hgroup>
          <h1>PACE</h1>
          <p>Strava Activity Image Generator</p>
        </hgroup>
      </header>
      
      <section>
        <app-card>
          <div slot="header">
            <h2>Welcome</h2>
          </div>
          <div>
            <p>PACE automatically generates AI-powered images from your Strava activities.</p>
            <p>Get started by authorizing with Strava to connect your account.</p>
          </div>
        </app-card>
      </section>
      
      <section>
        <h2>Quick Actions</h2>
        <nav>
          <ul>
            <li>
              <a href="/strava/auth" role="button">Authorize with Strava</a>
            </li>
          </ul>
        </nav>
      </section>
    </main>
  `;

  return baseTemplate({
    title: 'PACE - Strava Activity Image Generator',
    content,
  });
};

export default rootTemplate;
