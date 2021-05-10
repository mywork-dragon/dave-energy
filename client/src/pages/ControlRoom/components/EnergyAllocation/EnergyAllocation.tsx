import React from 'react';
import styled from 'styled-components';

import { LineAllocation, SeparateAllocation } from './components';
import { Title } from 'design-system';
import { EnergyAllocationModel } from 'models';

interface EnergyAllocationProps {
  allocation: EnergyAllocationModel | null;
}

export const EnergyAllocation: React.FC<EnergyAllocationProps> = ({
  allocation,
}) => {
  if (!allocation || !allocation.allocation.length) {
    return null;
  }

  return (
    <AllocationContainer>
      <WrappedTitle size="large">Energy Allocation</WrappedTitle>
      <SeparateAllocation allocation={allocation} />
      <LineAllocation allocation={allocation} />
    </AllocationContainer>
  );
};

const AllocationContainer = styled.div`
  margin: 0 50px 94px 50px;
`;

const WrappedTitle = styled(Title)`
  margin-bottom: 50px;
`;
