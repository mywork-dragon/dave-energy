import React from 'react';
import styled, { css } from 'styled-components';

import { colors, Flex, LegendButton } from 'design-system';
import { DeviceModel, DeviceName } from 'models';

export type SetDeviceVisibilityType = (
  deviceName: DeviceName,
  toVisibility: boolean,
) => void;
interface OwnProps {
  devices: DeviceModel[] | null;
  deviceToVisibleMap: Record<DeviceName, boolean>;
  setDeviceVisibility?: SetDeviceVisibilityType;
}

export const LegendButtons: React.FC<OwnProps> = ({
  devices,
  deviceToVisibleMap,
  setDeviceVisibility,
}) => {
  if (!history) {
    return null;
  }

  const deviceMap = [
    'Meter',
    'HVAC',
    'Lighting',
    'Other',
    'Battery',
    'Generator',
    'Solar',
  ].reduce((accum, deviceName) => {
    accum[deviceName as DeviceName] =
      devices?.find(device => device.name === deviceName) ?? null;
    return accum;
  }, {} as Record<DeviceName, DeviceModel | null>);

  // Only show operators if Meter and at least one of HVAC/Lighting/Other and
  // at least one of Battery/Generator/Solar
  const shouldShowOperators =
    deviceMap.Meter !== null &&
    (deviceMap.HVAC !== null ||
      deviceMap.Lighting !== null ||
      deviceMap.Other !== null) &&
    (deviceMap.Battery !== null ||
      deviceMap.Generator !== null ||
      deviceMap.Solar !== null);

  return (
    <LegendButtonsFlex alignItems="center">
      {deviceMap.Meter && (
        <MeterButton
          isActive={deviceToVisibleMap['Meter']}
          onClick={() =>
            setDeviceVisibility?.('Meter', !deviceToVisibleMap['Meter'])
          }
          activeColor={colors.blue}
        >
          Meter
        </MeterButton>
      )}
      {shouldShowOperators && <OperatorText>=</OperatorText>}
      <DemandFlex showBorder={shouldShowOperators}>
        {shouldShowOperators && <BuildingText>BUILDING</BuildingText>}
        {deviceMap.HVAC && (
          <LegendButton
            isActive={deviceToVisibleMap['HVAC']}
            onClick={() =>
              setDeviceVisibility?.('HVAC', !deviceToVisibleMap['HVAC'])
            }
            activeColor={colors.hvac}
          >
            HVAC
          </LegendButton>
        )}
        {deviceMap.Lighting && (
          <LegendButton
            isActive={deviceToVisibleMap['Lighting']}
            onClick={() =>
              setDeviceVisibility?.('Lighting', !deviceToVisibleMap['Lighting'])
            }
            activeColor={colors.lighting}
          >
            Lighting
          </LegendButton>
        )}
        {deviceMap.Other && (
          <LegendButton
            isActive={deviceToVisibleMap['Other']}
            onClick={() =>
              setDeviceVisibility?.('Other'!, !deviceToVisibleMap['Other'])
            }
            activeColor={colors.other}
          >
            Other
          </LegendButton>
        )}
      </DemandFlex>
      {shouldShowOperators && <OperatorText>-</OperatorText>}
      {deviceMap.Battery && (
        <LegendButton
          isActive={deviceToVisibleMap['Battery']}
          onClick={() =>
            setDeviceVisibility?.('Battery', !deviceToVisibleMap['Battery'])
          }
          activeColor={colors.battery}
        >
          Battery
        </LegendButton>
      )}
      {deviceMap.Generator && (
        <LegendButton
          isActive={deviceToVisibleMap['Generator']}
          onClick={() =>
            setDeviceVisibility?.('Generator', !deviceToVisibleMap['Generator'])
          }
          activeColor={colors.generator}
        >
          Generator
        </LegendButton>
      )}
      {deviceMap.Solar && (
        <LegendButton
          isActive={deviceToVisibleMap['Solar']}
          onClick={() =>
            setDeviceVisibility?.('Solar', !deviceToVisibleMap['Solar'])
          }
          activeColor={colors.yellow}
        >
          Solar
        </LegendButton>
      )}
    </LegendButtonsFlex>
  );
};

const LegendButtonsFlex = styled(Flex)`
  width: max-content;
  margin-bottom: 8px;
`;

const MeterButton = styled(LegendButton)`
  &&& {
    background-color: ${({ isActive }) =>
      isActive ? colors.blue : colors.white};
    color: ${({ isActive }) => (isActive ? colors.white : colors.blue)};
    border: 2px solid ${colors.blue};
  }
`;

const DemandFlex = styled.div<{ showBorder: boolean }>`
  ${({ showBorder }) =>
    showBorder
      ? css`
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px 10px 8px 0;
          border: 1px solid ${colors.grayCBD4E2};
          border-radius: 3px;
        `
      : ''};
`;

const OperatorTextCssMixin = css`
  font-family: Soleil;
  font-size: 13px;
  font-weight: 700;
  color: ${colors.blue};
`;

const OperatorText = styled.span`
  ${OperatorTextCssMixin};
  margin: 0 11px;
`;

const BuildingText = styled.span`
  ${OperatorTextCssMixin};
  width: 91px;
  display: inline-block;
  text-align: center;
`;
