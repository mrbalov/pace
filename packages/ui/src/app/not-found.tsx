/**
 * Not-found page.
 * @returns {JSX.Element} Not-found page.
 */
const NotFound = (): JSX.Element => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 170px)',
      gap: '16px',
    }}
  >
    <h1 style={{ margin: 0 }}>404</h1>
    <p style={{ margin: 0 }}>Page Not Found</p>
  </div>
);

export default NotFound;
