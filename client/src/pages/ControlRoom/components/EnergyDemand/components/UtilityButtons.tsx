import React from 'react';
import styled from 'styled-components';

import { Utility } from 'types';
import {
  BaseIconHOCType,
  Flex,
  IconElectricity,
  IconGas,
  IconSteam,
  UtilityButton,
} from 'design-system';
import { EnergyDemandModel } from 'models';

interface OwnProps {
  activeUtility?: Utility;
  demand: EnergyDemandModel | null;
  onClick?: (selectedUtility: Utility) => void;
}

export const UtilityButtons: React.FC<OwnProps> = ({
  activeUtility,
  demand,
  onClick,
}) => {
  if (Object.keys(demand ?? {}).length < 1) {
    return null;
  }

  const utilityToIconMap: Record<string, BaseIconHOCType> = {
    electricity: IconElectricity,
    gas: IconGas,
    steam: IconSteam,
  };

  const utilities = ['electricity', 'gas', 'steam'] as Utility[];

  const buttons = utilities.reduce((buttons, utility) => {
    if (demand?.getDemandByUtilityType(utility)) {
      const uppercased = utility.charAt(0).toUpperCase() + utility.slice(1);
      buttons.push(
        <WrappedUtilityButton
          style={{ marginRight: 50 }}
          dataTn={`historyUtilityButton-${utility}${
            utility === activeUtility ? '-active' : ''
          }`}
          key={utility}
          Icon={utilityToIconMap[utility]}
          isActive={activeUtility === utility}
          onClick={() => onClick?.(utility)}
          text={uppercased}
        />,
      );
    }
    return buttons;
  }, [] as React.ReactNode[]);
  return <UtilityButtonsWrapper>{buttons}</UtilityButtonsWrapper>;
};

const UtilityButtonsWrapper = styled(Flex)`
  width: max-content;
`;

const WrappedUtilityButton = styled(UtilityButton)`
  margin-right: 50px;
`;
