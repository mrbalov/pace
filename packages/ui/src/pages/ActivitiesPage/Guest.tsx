import { Card, Button, Text, Grid, Spacer } from '@geist-ui/core';
import { ArrowLeft } from '@geist-ui/icons';
import { Link } from 'wouter';

/**
 * Guest view.
 * @returns {JSX.Element} Guest view.
 */
const Guest = () => (
  <Grid.Container gap={2}>
    <Grid xs={24} sm={20} md={16} lg={12} style={{ margin: '0 auto' }}>
      <Card width="100%">
        <Card.Content>
          <Text h2>Authentication Required</Text>
          <Spacer h={1} />
          <Text>Please connect your Strava account to view your activities.</Text>
        </Card.Content>
        <Card.Footer>
          <Link href="/">
            <Button
              width="100%"
              icon={<ArrowLeft />}
              placeholder="Go to Home"
              onPointerEnterCapture={() => undefined}
              onPointerLeaveCapture={() => undefined}
            >
              Go to Home
            </Button>
          </Link>
        </Card.Footer>
      </Card>
    </Grid>
  </Grid.Container>
);

export default Guest;
