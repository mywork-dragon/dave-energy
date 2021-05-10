import React, { useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { colors, Flex, IconBuilding } from 'design-system';
import { RootState } from 'store';
import { changeActiveBuilding } from 'store/buildings';

interface OwnProps {
  className?: string;
}

export const BuildingsDropdown: React.FC<OwnProps> = ({ className }) => {
  const [isDropdownOpen, openDropdown] = React.useState(false);
  const activeBuilding = useSelector(({ buildings }: RootState) => buildings.activeBuilding);
  const buildings = useSelector(({ buildings }: RootState) => buildings.buildings,);
  const dispatch = useDispatch();
  let containerNode: Node | null = null;
  const ref = useCallback(node => (containerNode = node), []);
  useEffect(() => {
    const handleOnClick = (e: MouseEvent) => {
      if (!containerNode?.contains(e.target as Node)) {
        openDropdown(false);
      }
    };
    document.addEventListener('click', handleOnClick);
    return () => document.removeEventListener('click', handleOnClick);
  }, [containerNode]);

  return (
    <div className={className} ref={ref} style={{'position': 'relative', 'zIndex': 1000}}>
      <BuildingsDropdownDisplay alignItems='center' onClick={() => openDropdown(!isDropdownOpen)}>
        <IconBuilding />
        <SelectedBuilding data-tn='buildings-dropdown-display'>
          {activeBuilding?.address}
        </SelectedBuilding>
      </BuildingsDropdownDisplay>
      {isDropdownOpen && (
        <BuildingsDropdownOptions data-tn='buildings-dropdown-options'>
          <BuildingsDropdownList key='commercial-portfolio'>
            <BuildingsDropdownItem count={buildings?.length ?? 0}>
              Commercial Portfolio
            </BuildingsDropdownItem>
            {buildings?.map(building => (
              <BuildingsDropdownItem
                hasBullet
                data-tn={`buildings-dropdown-option-${building.address}`}
                key={building.address!}
                onClick={() => {
                  openDropdown(false);
                  dispatch(changeActiveBuilding(building));
                }}
              >
                {building.address}
              </BuildingsDropdownItem>
            ))}
            {/* Implement commercial vs residential portfolio logic
            when the time is right */}
          </BuildingsDropdownList>
        </BuildingsDropdownOptions>
      )}
    </div>
  );
};


const BuildingsDropdownDisplay = styled(Flex)`
  height: 45px;
  width: 250px;
  border-radius: 3px;
  background-color: ${colors.white};
  box-shadow: 0 2px 5px 0 rgba(87, 94, 104, 0.15);
  padding: 0 14px;
  cursor: pointer;
`;

const SelectedBuilding = styled.span`
  color: ${colors.gray575E68};
  font-family: Soleil;
  font-size: 16px;
  font-weight: 350;
  margin-left: 15px;

  :after {
    display: inline-block;
    position: absolute;
    right: 14px;
    content: '^';
    transform: scale(1.5, 1) rotate(180deg);
    font-weight: 300;
  }
`;

const BuildingsDropdownOptions = styled.div`
  width: 250px;
  max-height: 40vh;
  position: absolute;
  background-color: ${colors.white};
  box-shadow: 0 20px 60px 0 rgba(87, 94, 104, 0.2);
  border-radius: 3px;
  padding: 0 18px;
  z-index: 2;
  overflow-y: scroll;
`;

const BuildingsDropdownList = styled.ul`
  position: relative;
  padding: 6px 0;
  :not(:last-of-type) {
    border-bottom: 1px solid ${colors.grayEEF3FA};
  }
`;

const BuildingsDropdownItem = styled.li<{
  count?: number;
  hasBullet?: boolean;
}>`
  padding: 0px 16px;
  height: 40px;
  color: ${colors.gray575E68};
  font-family: Aktiv Grotesk;
  font-size: 15px;
  font-weight: 500;
  line-height: 43px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  svg {
    position: relative;
    display: inline-block;
    top: 4px;
    margin-right: 10px;
  }

  :before {
    ${({ hasBullet }) =>
      hasBullet
        ? css`
            content: '•';
            margin-right: 12px;
          `
        : ''}
  }

  :after {
    content: '${({ count }) => count}';
    color: ${colors.grayCBD4E2};
    position: absolute;
    right: 16px;
  }

  :hover {
    background-color: ${colors.green};
    border-radius: 20px;
    color: ${colors.white};
    :after {
      color: ${colors.white};
    }
    * path {
      fill: ${colors.white};
    }
  }
`;
