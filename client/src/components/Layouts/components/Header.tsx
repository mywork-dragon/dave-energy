import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { BuildingsDropdown } from './BuildingsDropdown';
import {
  Avatar,
  colors,
  DavidEnergyLogo,
  Flex,
  HeaderNavLink,
  IconControlRoom,
  IconAnalytics,
  IconSustainability,
  IconReports,
  IconNotifications,
} from 'design-system';
import { getBuildings as getBuildingsAction } from 'store/buildings';
import { RootState } from 'store';
import { UserRole } from 'models';

interface HeaderProps {
  className?: string;
  isSticky?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  className = '',
  isSticky = false,
}) => {
  const dispatch = useDispatch();
  const buildings = useSelector((state: RootState) => state.buildings?.buildings);
  const user = useSelector(({ user }: RootState) => user?.instance);
  const isManagement = user?.userRole === UserRole.MANAGEMENT;

  useEffect(() => {
    if (!buildings) {
      dispatch(getBuildingsAction());
    }
  }, [buildings]);

  return (
    <HeaderContainer
      className={className}
      justifyContent="space-between"
      isSticky={isSticky}
    >
      <Flex alignItems="center">
        <DavidEnergyLogo css="margin-right: 50px;" />
        <WrappedBuildingsDropdown />
        {!isManagement && (
          <WrappedLink icon={<IconControlRoom />} to={'/control-room'}>
            Control Room
          </WrappedLink>
        )}
        <WrappedLink icon={<IconAnalytics />} to={'/analytics'}>
          Analytics
        </WrappedLink>
        {!isManagement && (
          <WrappedLink icon={<IconSustainability />} to={'/sustainability'}>
            Sustainability
          </WrappedLink>
        )}
      </Flex>
      <RightSide alignItems="center">
        <IconReports css="margin-right: 42px;" />
        <IconNotifications css="margin-right: 50px;" />
        <Avatar imgUrl="https://images.unsplash.com/photo-1495568995596-9e40959aa178?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80" />
      </RightSide>
    </HeaderContainer>
  );
};

const HeaderContainer = styled(Flex)<{ isSticky: boolean }>`
  position: ${({ isSticky }) => (isSticky ? 'sticky' : 'initial')};
  top: 0;
  height: 80px;
  border-bottom: 1px solid ${colors.grayEEF3FA};
  background-color: ${colors.white};
  z-index: 4;
`;

const WrappedBuildingsDropdown = styled(BuildingsDropdown)`
  margin-right: 50px;
`;

const WrappedLink = styled(HeaderNavLink)`
  &&& {
    margin-right: 50px;
  }
`;

const RightSide = styled(Flex)`
  height: 100%;
`;
