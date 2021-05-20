import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { BuildingsDropdown } from './BuildingsDropdown';
import {
  colors,
  DavidEnergyLogo,
  Flex,
  HeaderNavLink,
  IconControlRoom,
  IconAnalytics,
  IconSustainability,
  Title,
} from 'design-system';
import { getDisplayReports } from 'store/admin';
import { logoutUser } from 'store/user';
import { getBuildings as getBuildingsAction } from 'store/buildings';
import { RootState } from 'store';

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
  const history = useHistory();
  const reports = useSelector(({ admin }: RootState) => admin?.reports);

  useEffect(() => {
    if (!buildings) {
      dispatch(getBuildingsAction());
    }
    if (!reports.length) {
      dispatch(getDisplayReports());
    }
  }, [buildings, reports]);

  return (
    <HeaderContainer className={className} justifyContent='space-between' isSticky={isSticky}>
      <Flex alignItems='center'>
        <DavidEnergyLogo css='margin-right: 50px;' />
        <WrappedBuildingsDropdown />
        {reports.map((report: string, i: number) => {
          switch (report) {
            case 'Analytics-Engineer':
              return (
                <WrappedLink icon={<IconAnalytics />} to={'/analytics-engineer'} key={i}>
                  Analytics
                </WrappedLink>
              )
            case 'Analytics-Management':
              return (
                <WrappedLink icon={<IconAnalytics />} to={'/analytics-management'} key={i}>
                  Analytics
                </WrappedLink>
              )
            case 'Control Room':
              return (
                <WrappedLink icon={<IconControlRoom />} to={'/control-room'} key={i}>
                  {report}
                </WrappedLink>
              )
            case 'Sustainability':
              return (
                <WrappedLink icon={<IconSustainability />} to={'/sustainability'} key={i}>
                  {report}
                </WrappedLink>
              )
          }
        })}
      </Flex>
      <RightSide alignItems='center'>
        <Title css={'cursor: pointer;'} onClick={() => dispatch(logoutUser(history))}>
          Sign Out
        </Title>
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
