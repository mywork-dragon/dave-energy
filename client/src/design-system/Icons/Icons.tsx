import React from 'react';
import styled, { css } from 'styled-components';

import DavidEnergyLogoSvg from 'images/davidEnergyLogo.svg';
import DavidEnergyLogoMarkSvg from 'images/davidEnergyLogoMark.svg';
import EnergyStarLogoSvg from 'images/energyStarLogo.svg';
import IconAnalyticsSvg from 'images/iconAnalytics.svg';
import IconArrowDownSvg from 'images/iconArrowDown.svg';
import IconArrowLeftSvg from 'images/iconArrowLeft.svg';
import IconArrowRightSvg from 'images/iconArrowRight.svg';
import IconArrowUpSvg from 'images/iconArrowUp.svg';
import IconBatterySvg from 'images/iconArrowRight.svg';
import IconBuildingSvg from 'images/iconBuilding.svg';
import IconCalendarSvg from 'images/iconCalendar.svg';
import IconChillerSvg from 'images/iconChiller.svg';
import IconControlRoomSvg from 'images/iconControlRoom.svg';
import IconCoolingSvg from 'images/iconCooling.svg';
import IconDownloadSvg from 'images/iconDownload.svg';
import IconDropdownArrowSvg from 'images/iconDropdownArrow.svg';
import IconElectricitySvg from 'images/iconElectricity.svg';
import IconElevatorsSvg from 'images/iconElevators.svg';
import IconGasSvg from 'images/iconGas.svg';
import IconHumiditySvg from 'images/iconHumidity.svg';
import IconHVACSvg from 'images/iconHVAC.svg';
import IconLightingSvg from 'images/iconLighting.svg';
import IconMapSvg from 'images/iconMap.svg';
import IconNotificationsSvg from 'images/iconNotifications.svg';
import IconOilSvg from 'images/iconOil.svg';
import IconOtherSvg from 'images/iconOther.svg';
import IconPowerSvg from 'images/iconPower.svg';
import IconPumpsSvg from 'images/iconPumps.svg';
import IconReportsSvg from 'images/iconReports.svg';
import IconRevertSvg from 'images/iconRevert.svg';
import IconShareSvg from 'images/iconShare.svg';
import IconSolarSvg from 'images/iconSolar.svg';
import IconSteamSvg from 'images/iconSteam.svg';
import IconSustainabilitySvg from 'images/iconSustainability.svg';
import IconTemperatureSvg from 'images/iconTemperature.svg';
import IconTimeSvg from 'images/iconTime.svg';
import IconWarningSvg from 'images/iconWarning.svg';
import IconWaterSvg from 'images/iconWater.svg';

interface BaseIconHOCProps {
  className?: string;
  color?: string;
  dataTn?: string;
}

export type BaseIconHOCType = React.FC<BaseIconHOCProps>;

type Props = BaseIconHOCProps & React.HTMLAttributes<HTMLDivElement>;

export const BaseIconHOC = (Icon: React.FC): React.FC<Props> => {
  const WrappedBaseIcon: React.FC<Props> = ({ className, color, dataTn }) => (
    <StyledBaseIcon color={color} className={className} data-tn={dataTn}>
      <Icon />
    </StyledBaseIcon>
  );
  return WrappedBaseIcon;
};

const StyledBaseIcon = styled.div<Pick<BaseIconHOCProps, 'color'>>`
  display: inline-block;
  position: relative;
  * > path {
    ${({ color }) =>
      color
        ? css`
            fill: ${color};
            stroke: ${color};
          `
        : ''};
  }
`;

export const DavidEnergyLogo = BaseIconHOC(DavidEnergyLogoSvg);
export const DavidEnergyLogoMark = BaseIconHOC(DavidEnergyLogoMarkSvg);
export const EnergyStarLogo = BaseIconHOC(EnergyStarLogoSvg);
export const IconAnalytics = BaseIconHOC(IconAnalyticsSvg);
export const IconArrowDown = BaseIconHOC(IconArrowDownSvg);
export const IconArrowLeft = BaseIconHOC(IconArrowLeftSvg);
export const IconArrowRight = BaseIconHOC(IconArrowRightSvg);
export const IconArrowUp = BaseIconHOC(IconArrowUpSvg);
export const IconBattery = BaseIconHOC(IconBatterySvg);
export const IconBuilding = BaseIconHOC(IconBuildingSvg);
export const IconCalendar = BaseIconHOC(IconCalendarSvg);
export const IconChiller = BaseIconHOC(IconChillerSvg);
export const IconControlRoom = BaseIconHOC(IconControlRoomSvg);
export const IconCooling = BaseIconHOC(IconCoolingSvg);
export const IconDownload = BaseIconHOC(IconDownloadSvg);
export const IconDropdownArrow = BaseIconHOC(IconDropdownArrowSvg);
export const IconElectricity = BaseIconHOC(IconElectricitySvg);
export const IconElevators = BaseIconHOC(IconElevatorsSvg);
export const IconGas = BaseIconHOC(IconGasSvg);
export const IconHumidity = BaseIconHOC(IconHumiditySvg);
export const IconHVAC = BaseIconHOC(IconHVACSvg);
export const IconLighting = BaseIconHOC(IconLightingSvg);
export const IconMap = BaseIconHOC(IconMapSvg);
export const IconNotifications = BaseIconHOC(IconNotificationsSvg);
export const IconOil = BaseIconHOC(IconOilSvg);
export const IconOther = BaseIconHOC(IconOtherSvg);
export const IconPower = BaseIconHOC(IconPowerSvg);
export const IconPumps = BaseIconHOC(IconPumpsSvg);
export const IconReports = BaseIconHOC(IconReportsSvg);
export const IconRevert = BaseIconHOC(IconRevertSvg);
export const IconShare = BaseIconHOC(IconShareSvg);
export const IconSolar = BaseIconHOC(IconSolarSvg);
export const IconSteam = BaseIconHOC(IconSteamSvg);
export const IconSustainability = BaseIconHOC(IconSustainabilitySvg);
export const IconTemperature = BaseIconHOC(IconTemperatureSvg);
export const IconTime = BaseIconHOC(IconTimeSvg);
export const IconWarning = BaseIconHOC(IconWarningSvg);
export const IconWater = BaseIconHOC(IconWaterSvg);
