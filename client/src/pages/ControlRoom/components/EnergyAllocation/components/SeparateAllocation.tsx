import React from 'react';
import styled from 'styled-components';

import { Flex, colors } from 'design-system';
import { EnergyAllocationModel, deviceToIconMap } from 'models';

interface EnergyAllocationProps {
  allocation: EnergyAllocationModel | null;
}

export const SeparateAllocation: React.FC<EnergyAllocationProps> = ({
  allocation,
}) => {
  return (
    <Flex style={{ marginBottom: '29px' }}>
      {allocation?.allocation.map(({ name, quantity }, index) => {
        const DeviceIcon =
          deviceToIconMap.hasOwnProperty(name as string) &&
          deviceToIconMap[name as string];
        return (
          <Flex
            key={name}
            style={{ marginRight: '100px', opacity: `${100 - index * 10}%` }}
            flexDirection="column"
          >
            <IconQuantityFlex alignItems="center" justifyContent="center">
              <span data-tn={`energyAllocation-separate-icon${name}`}>
                {DeviceIcon && <DeviceIcon />}
              </span>
              <AllocationQuantity
                data-tn={`energyAllocation-separate-quantity${name}`}
              >
                {quantity}%
              </AllocationQuantity>
            </IconQuantityFlex>
            <AllocationName data-tn={`energyAllocation-separate-name${name}`}>
              {name}
            </AllocationName>
          </Flex>
        );
      })}
    </Flex>
  );
};

const AllocationQuantity = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 31px;
  font-weight: 500;
  color: ${colors.blue};
  margin-left: 15px;
`;

const AllocationName = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 13px;
  font-weight: 500;
  color: ${colors.blue};
  white-space: nowrap;
`;

const IconQuantityFlex = styled(Flex)`
  margin-bottom: 14px;

  > svg {
    position: relative;
    top: -4px;
  }

  * path {
    fill: ${colors.blue};
  }
`;
