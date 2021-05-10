import { SeriesBarOptions, SeriesLineOptions } from 'highcharts';

import { HistoryDocument, HistoryModel } from 'models';
import { Utility } from 'types';
import {
  BaseIconHOCType,
  colors,
  IconBattery,
  IconChiller,
  IconCooling,
  IconElevators,
  IconHVAC,
  IconLighting,
  IconOther,
  IconPumps,
} from 'design-system';

export type DeviceName =
  | 'Meter'
  | 'HVAC'
  | 'Lighting'
  | 'Other'
  | 'Battery'
  | 'Generator'
  | 'Solar';

export type WattUnit = 'kW' | 'W';

const deviceToIndexMap: Record<DeviceName, number> = {
  Meter: 7,
  HVAC: 6,
  Lighting: 5,
  Other: 4,
  Solar: 3,
  Generator: 2,
  Battery: 1,
};

const deviceToColorMap: Record<DeviceName, string> = {
  Meter: colors.blue,
  HVAC: colors.hvac,
  Lighting: colors.lighting,
  Other: colors.other,
  Battery: colors.battery,
  Generator: colors.generator,
  Solar: colors.yellow,
};

export const deviceToIconMap: Record<string, BaseIconHOCType> = {
  Battery: IconBattery,
  Chiller: IconChiller,
  Cooling: IconCooling,
  Elevators: IconElevators,
  HVAC: IconHVAC,
  Light: IconLighting,
  Lighting: IconLighting,
  Other: IconOther,
  Pumps: IconPumps,
  Solar: IconOther,
  Meter: IconBattery,
};

export interface DeviceDocument {
  readonly building?: number | null;
  readonly energyType?: Utility | null;
  readonly id?: number | null;
  readonly name?: DeviceName | null;
  readonly historyData?: HistoryDocument[] | null;
  readonly unit?: WattUnit | null;
}

export class DeviceModel {
  public readonly building: number | null;
  public readonly energyType: Utility | null;
  public readonly id: number | null;
  public readonly name: DeviceName | null;
  public readonly historyData: HistoryModel[] | null;
  public readonly unit: WattUnit | null;

  constructor(deviceDocument: DeviceDocument) {
    const {
      building,
      energyType,
      id,
      name,
      historyData,
      unit,
    } = deviceDocument;
    this.building = building ?? null;
    this.energyType = energyType ?? null;
    this.id = id ?? null;
    this.name = name ?? null;
    this.historyData =
      historyData?.map(history => new HistoryModel(history)) ?? null;
    this.unit = unit ?? null;
  }

  public generateSeriesBarOptions = (
    visible: boolean,
    deviceToVisibleMap: Record<DeviceName, boolean>,
  ): {
    positive: SeriesBarOptions;
    negative: SeriesBarOptions;
  } => {
    // Show the bar outline for HVAC, Lighting, and Other if they and Meter
    // are not visible
    const showBarOutline =
      ['HVAC', 'Lighting', 'Other'].some(
        buildingDevice => buildingDevice === this.name,
      ) &&
      !visible &&
      !deviceToVisibleMap['Meter'];
    let barOutlineProps: Partial<SeriesBarOptions> = {};
    if (showBarOutline) {
      barOutlineProps = {
        animation: false,
        color: colors.white,
        borderColor: colors.grayCBD4E2,
        borderRadius: 1,
        borderWidth: 1,
        pointWidth: 4,
        visible: true,
      };
    }

    const positive: (number | null)[] = [];
    const negative: (number | null)[] = [];

    this.historyData?.map(({ quantity }) => {
      quantity = quantity ?? 0;
      if (this.unit === 'W') {
        quantity = quantity / 1000;
      }
      quantity = Math.round(quantity);

      if (quantity === 0) {
        positive.push(null);
        negative.push(null);
      } else if (quantity < 0) {
        positive.push(null);
        negative.push(quantity);
      } else if (quantity > 0) {
        positive.push(quantity);
        negative.push(null);
      }
    });

    let commonProps: SeriesBarOptions | SeriesLineOptions;

    if (this.name === 'Meter' && !visible) {
      // When Meter is turned off, we will show this as an line instead of a bar
      commonProps = {
        animation: false,
        color: deviceToColorMap[this.name! as DeviceName],
        id: this.id?.toString() ?? undefined,
        index: deviceToIndexMap[this.name! as DeviceName],
        name: this.name || '',
        type: 'line',
        visible: true,
        marker: {
          enabled: false,
          radius: 3,
        },
      };
    } else {
      commonProps = {
        animation: false,
        color: deviceToColorMap[this.name! as DeviceName],
        borderColor: deviceToColorMap[this.name! as DeviceName],
        borderWidth: 1,
        borderRadius: 1,
        id: this.id?.toString() ?? undefined,
        index: deviceToIndexMap[this.name! as DeviceName],
        name: this.name || '',
        pointWidth: 4,
        type: 'bar',
        visible,
        ...barOutlineProps,
      };
    }

    return {
      positive: {
        ...commonProps,
        data: positive,
      } as SeriesBarOptions,
      negative: {
        ...commonProps,
        data: negative,
      } as SeriesBarOptions,
    };
  };
}
