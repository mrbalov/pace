import { Button, Grid, Text } from '@geist-ui/core';
import { Activity as ActivityIcon } from '@geist-ui/icons';
import { Link } from 'wouter';

/**
 * Member view.
 * @returns {JSX.Element} Member view.
 */
const Member = () => (
  <Grid.Container gap={2} justify='center' alignItems='center' direction='column'>
    <Grid xs={24} md={18} lg={12} style={{ textAlign: 'center' }}>
      <Text h1 style={{ color: '#d8a0c7' }}>
        Welcome to PACE!
      </Text>
    </Grid>
    <Grid xs={24} md={18} lg={12} style={{ textAlign: 'center' }}>
      <Text
        p
        type='secondary'
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          lineHeight: '1.7',
        }}
      >
        You're successfully connected to Strava. Review your activities and generate beautiful AI images for them!
      </Text>
    </Grid>
    <Grid xs={24} md={18} lg={12} style={{ textAlign: 'center' }}>
      <Link href='/activities'>
        <Button
          type='default'
          icon={<ActivityIcon />}
          placeholder='View Activities'
          onPointerEnterCapture={() => undefined}
          onPointerLeaveCapture={() => undefined}
        >
          <span style={{ marginLeft: '20px' }}>View Activities</span>
        </Button>
      </Link>
    </Grid>
  </Grid.Container>
);

export default Member;
