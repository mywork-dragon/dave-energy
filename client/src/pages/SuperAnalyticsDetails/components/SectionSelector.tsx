import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { colors, Flex, IconDropdownArrow, Menu } from 'design-system';
import { SuperAnalyticsTitle } from '../types';
import { RoutePaths } from 'routes';

interface Section {
  title: SuperAnalyticsTitle;
  path: string;
}

interface Props {
  sectionTitle: SuperAnalyticsTitle;
}

export const SectionSelector: React.FC<Props> = ({ sectionTitle }: Props) => {
  const sections: Section[] = [
    {
      title: SuperAnalyticsTitle.costsAndSavings,
      path: RoutePaths.analyticsManagementCostsAndSaving,
    },
    {
      title: SuperAnalyticsTitle.energyDemand,
      path: RoutePaths.analyticsManagementEnergyDemand,
    },
    {
      title: SuperAnalyticsTitle.energyConsumption,
      path: RoutePaths.analyticsManagementEnergyConsumption,
    },
    {
      title: SuperAnalyticsTitle.energyUsagePerCapita,
      path: RoutePaths.analyticsManagementEnergyUsagePerCapita,
    },
    {
      title: SuperAnalyticsTitle.energyCostPerCapita,
      path: RoutePaths.analyticsManagementEnergyCostPerCapita,
    },
  ];

  const history = useHistory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeItem =
    sections.find(({ title }) => title === sectionTitle) ?? sections[0];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const onSectionSelect = (item: Section) => {
    history.push(item.path);
    closeMenu();
  };

  const onInitialClick = () => {
    setIsMenuOpen(true);
  };

  return (
    <DropdownContainer>
      <Flex alignItems='center' onClick={onInitialClick}>
        <SectionTitle>{activeItem.title}</SectionTitle>
        <IconDropdownArrow />
      </Flex>
      {isMenuOpen && (
        <Menu
          name='title'
          items={sections}
          closeMenu={closeMenu}
          activeItem={activeItem}
          onSelect={onSectionSelect}
        />
      )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  margin-top: 43px;
  position: relative;
  cursor: pointer;
  width: max-content;
`;

const SectionTitle = styled.h3`
  margin-right: 17px;
  font-family: Aktiv Grotesk;
  font-weight: 500;
  font-size: 31px;
  line-height: 39px;
  color: ${colors.blue};
`;
