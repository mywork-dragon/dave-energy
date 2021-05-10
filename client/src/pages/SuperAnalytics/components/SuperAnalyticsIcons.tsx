import React from 'react';
import styled from 'styled-components';

import {
  BaseIconHOCType,
  colors,
  Flex,
  IconElectricity,
  IconGas,
  IconSteam,
  IconOil,
  IconWater,
} from 'design-system';

export type AnalyticsIconNames =
  | 'electricity'
  | 'gas'
  | 'steam'
  | 'oil'
  | 'water';

export type AnalyticsIcon = { name: AnalyticsIconNames; isActive: boolean };

const mapNameToIcons: Record<string, BaseIconHOCType> = {
  electricity: IconElectricity,
  gas: IconGas,
  steam: IconSteam,
  oil: IconOil,
  water: IconWater,
};

interface Props {
  icons: AnalyticsIcon[];
}

export const SuperAnalyticsIcons: React.FC<Props> = ({ icons }: Props) => {
  return (
    <Flex css={'margin-top: 22px;'}>
      {icons.map(({ name, isActive }) => {
        const Icon = mapNameToIcons[name];
        return (
          <IconWrapper key={name}>
            <Icon color={isActive ? colors.blue : colors.grayCBD4E2} />
          </IconWrapper>
        );
      })}
    </Flex>
  );
};

const IconWrapper = styled.div`
  &:not(:last-of-type) {
    margin-right: 30px;
  }
`;
