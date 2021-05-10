import React from 'react';
import styled from 'styled-components';

import { Flex, colors } from 'design-system';
import { EnergyAllocationModel, deviceToIconMap } from 'models';

interface EnergyAllocationProps {
  allocation: EnergyAllocationModel | null;
}

export const LineAllocation: React.FC<EnergyAllocationProps> = ({
  allocation,
}) => {
  return (
    <LineAllocationFlex>
      {allocation?.allocation.map(({ name, quantity }, index) => {
        const DeviceIcon =
          deviceToIconMap.hasOwnProperty(name as string) &&
          deviceToIconMap[name as string];
        return (
          <LineAllocationSegment
            key={name}
            quantity={quantity}
            index={index}
            alignItems="center"
          >
            <span data-tn={`energyAllocation-line-icon${name}`}>
              {DeviceIcon && <DeviceIcon />}
            </span>
            <AllocationQuantity
              data-tn={`energyAllocation-line-quantity${name}`}
            >
              {`${quantity}%`}
            </AllocationQuantity>
          </LineAllocationSegment>
        );
      })}
    </LineAllocationFlex>
  );
};

const LineAllocationFlex = styled(Flex)`
  width: 100%;
  height: 35px;
`;

const AllocationQuantity = styled.span`
  font-family: Soleil;
  font-size: 13px;
  font-weight: 350;
  color: ${colors.white};
  margin-left: 10px;
`;

const LineAllocationSegment = styled(Flex)<{
  index: number;
  quantity?: number;
}>`
  padding-left: 10px;
  height: 100%;
  width: ${({ quantity }) => quantity}%;
  background-color: ${colors.blue};
  opacity: ${({ index }) => 100 - index * 10}%;

  :first-of-type {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  :last-of-type {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  * path {
    fill: ${colors.white};
  }

  > * {
    display: ${({ quantity = 0 }) => (quantity < 10 ? 'none' : 'block')};
  }
`;
