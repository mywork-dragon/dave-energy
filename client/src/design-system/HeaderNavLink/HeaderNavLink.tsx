import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { colors, Flex } from 'design-system';

import './headerNavLink.less';

interface HeaderNavLinkProps {
  className?: string;
  children?: string;
  to: string;
  icon?: React.ReactNode;
}

export const HeaderNavLink: React.FC<HeaderNavLinkProps> = ({
  className,
  children,
  to,
  icon,
}) => {
  return (
    <HeaderNavLinkContainer
      activeClassName="header-nav-link-active"
      className={className}
      to={to}
    >
      <NavLinkIconTextWrapper alignItems="center">
        {icon}
        <NavLinkText>{children}</NavLinkText>
      </NavLinkIconTextWrapper>
    </HeaderNavLinkContainer>
  );
};

const HeaderNavLinkContainer = styled(NavLink)`
  width: max-content;
  height: 81px;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  color: ${colors.gray575E68};

  img {
    background: ${colors.gray575E68};
  }
`;

const NavLinkIconTextWrapper = styled(Flex)`
  &&& {
    height: inherit;
  }
`;

const NavLinkText = styled.div`
  font-family: Soleil;
  font-size: 16px;
  font-weight: 350;
  margin-left: 14.5px;
`;
