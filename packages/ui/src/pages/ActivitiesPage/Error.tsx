import { Card, Button, Text, Grid, Spacer, Note } from '@geist-ui/core';

interface ErrorProps {
  error: string;
  refetchActivities: () => void;
}

/**
 * Error view.
 * @param {ErrorProps} props - Component props.
 * @param {string} props.error - Error message to display.
 * @param {Function} props.refetchActivities - Function to refetch activities on retry.
 * @returns {JSX.Element} Error view.
 */
const Error = ({ error, refetchActivities }: ErrorProps) => (
  <Grid.Container gap={2}>
    <Grid xs={24} sm={20} md={16} lg={12} style={{ margin: '0 auto' }}>
      <Card width="100%">
        <Card.Content>
          <Note type="error" label="Error">
            <Text>{error}</Text>
            <Spacer h={1} />
            <Text type="secondary" small>
              We encountered an issue while fetching your activities. Please try again.
            </Text>
          </Note>
        </Card.Content>
        <Card.Footer>
          <Button
            onClick={refetchActivities}
            width="100%"
            placeholder="Try Again"
            onPointerEnterCapture={() => undefined}
            onPointerLeaveCapture={() => undefined}
          >
            Try Again
          </Button>
        </Card.Footer>
      </Card>
    </Grid>
  </Grid.Container>
);

export default Error;
