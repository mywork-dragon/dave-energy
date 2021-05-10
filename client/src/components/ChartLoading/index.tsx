import React from 'react';
import { Header, Segment } from 'semantic-ui-react';

import { Spinner } from 'design-system';


export const ChartLoading = () => (
  <Segment placeholder>
    <Header icon textAlign='center'>
      <Spinner />
    </Header>
  </Segment>
)
