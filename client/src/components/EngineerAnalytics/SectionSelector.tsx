import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { colors, Flex, IconDropdownArrow, Menu } from 'design-system';
import { EngineerAnalyticsTitle } from './types';
import { RoutePaths } from 'routes';

interface Section {
  title: EngineerAnalyticsTitle;
  path: string;
}

interface Props {
  sectionTitle: EngineerAnalyticsTitle;
}

export const SectionSelector: React.FC<Props> = ({ sectionTitle }: Props) => {
  const sections: Section[] = [
    {
      title: EngineerAnalyticsTitle.assets,
      path: RoutePaths.assetsAnalytics,
    },
    {
      title: EngineerAnalyticsTitle.energyDemand,
      path: RoutePaths.energyDemandAnalytics,
    },
    {
      title: EngineerAnalyticsTitle.energyConsumption,
      path: RoutePaths.energyConsumptionAnalytics,
    },
    {
      title: EngineerAnalyticsTitle.annualExport,
      path: RoutePaths.annualExport,
    },
    {
      title: EngineerAnalyticsTitle.solarGeneration,
      path: RoutePaths.solarGenerationAnalytics,
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
      <Flex alignItems="center" onClick={onInitialClick}>
        <SectionTitle>{activeItem.title}</SectionTitle>
        <IconDropdownArrow />
      </Flex>
      {isMenuOpen && (
        <Menu
          onSelect={onSectionSelect}
          closeMenu={closeMenu}
          activeItem={activeItem}
          items={sections}
          name="title"
        />
      )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  width: max-content;
  margin-top: 43px;
  position: relative;
  cursor: pointer;
`;

const SectionTitle = styled.h3`
  margin-right: 17px;
  font-family: Aktiv Grotesk;
  font-weight: 500;
  font-size: 31px;
  line-height: 39px;
  color: ${colors.blue};
`;
