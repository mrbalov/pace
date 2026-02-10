import { Button, Grid, Text } from '@geist-ui/core';
import { Activity as ActivityIcon } from '@geist-ui/icons';

import { authorizeStrava } from '../../api/strava';

/**
 * Guest view.
 * @returns {JSX.Element} Guest view.
 */
const Guest = () => (
  <Grid.Container gap={2} justify="center" alignItems="center" direction="column">
    <Grid xs={24} md={18} lg={12} style={{ textAlign: 'center' }}>
      <Text h1 style={{ color: '#d8a0c7' }}>
        Welcome to PACE!
      </Text>
    </Grid>
    <Grid xs={24} md={18} lg={12} style={{ textAlign: 'center' }}>
      <Text
        p
        type="secondary"
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          lineHeight: '1.7',
        }}
      >
        <strong>PACE</strong> is a{' '}
        <span style={{ fontWeight: 'bold', color: '#d8a0c7', letterSpacing: '0.3px' }}>
          Personal Activity Canvas Engine
        </span>
        . It helps you create beautiful visualizations of your athletic activities. Connect your
        Strava account to get started and transform your workout data into stunning images!
      </Text>
    </Grid>
    <Grid xs={24} md={18} lg={12} style={{ textAlign: 'center' }}>
      <Button
        type="default"
        icon={<ActivityIcon />}
        onClick={authorizeStrava}
        placeholder="Authorize with Strava"
        onPointerEnterCapture={() => undefined}
        onPointerLeaveCapture={() => undefined}
      >
        <span style={{ marginLeft: '20px' }}>Authorize with Strava</span>
      </Button>
    </Grid>
  </Grid.Container>
);

export default Guest;
