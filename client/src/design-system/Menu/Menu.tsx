import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import { colors } from 'design-system';

interface MenuProps<T> {
  onSelect: (item: T) => void;
  closeMenu: () => void;
  activeItem: T;
  items: T[];
  name: keyof T;
}

export const Menu = <T,>({
  onSelect,
  activeItem,
  closeMenu,
  items,
  name,
}: React.PropsWithChildren<MenuProps<T>>) => {
  const ref = useRef<HTMLUListElement>(null);

  // Close the menu if the user clicks anywhere outside of the Menu
  const handleOnClick = (e: any) => {
    if (!ref?.current?.contains(e.target)) {
      closeMenu();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOnClick);
    return () => {
      document.removeEventListener('click', handleOnClick);
    };
  }, [ref]);

  return (
    <MenuContainer ref={ref}>
      {items?.map(item => (
        <Item
          key={String(item[name!])}
          isActive={activeItem?.[name!] === item[name!]}
          onClick={() => onSelect(item)}
        >
          {item[name!]}
        </Item>
      ))}
    </MenuContainer>
  );
};

const MenuContainer = styled.ul`
  width: 280px;
  position: absolute;
  top: 0;
  border-radius: 3px;
  background-color: ${colors.white};
  box-shadow: 0 20px 50px 0 rgba(87, 94, 104, 0.2);
  padding: 30px 24px;
  z-index: 2;
`;

const Item = styled.li<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  font-family: Aktiv Grotesk;
  font-size: 15px;
  font-weight: 500;
  height: 40px;
  cursor: pointer;
  padding: 0 16px;
  border-radius: 20px;
  color: ${({ isActive }) => (isActive ? colors.white : colors.blue)};
  background-color: ${({ isActive }) => (isActive ? colors.green : 'unset')};
`;
