import { DeviceDocument, DeviceModel, DeviceName } from 'models';
import { Utility } from 'types';
import { SeriesBarOptions, SeriesLineOptions } from 'highcharts';
import { colors } from 'design-system';
export interface EnergyDemandDocument {
  electricity?: DeviceDocument[];
  steam?: DeviceDocument[];
  gas?: DeviceDocument[];
  target?: number;
}

export interface PositiveNegativeSeriesOptions {
  positive: (SeriesBarOptions | SeriesLineOptions)[];
  negative: (SeriesBarOptions | SeriesLineOptions)[];
}

export class EnergyDemandModel {
  public readonly electricity: DeviceModel[] | null;
  public readonly steam: DeviceModel[] | null;
  public readonly gas: DeviceModel[] | null;
  public readonly target: number | null;

  constructor(energyDemandDocument: EnergyDemandDocument) {
    this.electricity = this.initializeEnergyType(energyDemandDocument['electricity']);
    this.steam = this.initializeEnergyType(energyDemandDocument['steam']);
    this.gas = this.initializeEnergyType(energyDemandDocument['gas']);
    this.target = energyDemandDocument.target ?? null;
  }

  private initializeEnergyType(DeviceDocument?: DeviceDocument[]): DeviceModel[] | null {
    if (!DeviceDocument) {
      return null;
    }
    return DeviceDocument.map(doc => new DeviceModel(doc));
  }

  public getDemandByUtilityType = (utility: Utility): DeviceModel[] | null =>
    this[utility] ?? null;

  public getDevicesByEnergyType = (energyType: Utility): DeviceModel[] =>
    this?.[energyType] ?? [];

  public getDeviceNamesByEnergyType = (energyType: Utility): DeviceName[] =>
    this?.[energyType]!.map(device => device.name!) ?? [];

  public generateSeriesOptionsForEnergyType = (
    energyType: Utility,
    deviceToVisibleMap: Record<DeviceName, boolean>,
  ): PositiveNegativeSeriesOptions => {
    const series = this.getDevicesByEnergyType(energyType)?.reduce(
      (accum, device) => {
        const { positive, negative } = device.generateSeriesBarOptions(
          deviceToVisibleMap[device.name! as DeviceName],
          deviceToVisibleMap,
        );
        accum.positive.push(positive);
        accum.negative.push(negative);
        return accum;
      },
      { positive: [], negative: [] } as PositiveNegativeSeriesOptions,
    );

    // Once the series are generated, sort by the index. Lower index indicates
    // it to be closer to the x-Axis than a higher index.
    series.positive.sort((a, b) => a.index! - b.index!);
    series.negative.sort((a, b) => a.index! - b.index!);

    return series;
  };

  public generateTargetLineSeriesOptions = (): SeriesLineOptions => {
    const data: (number | null)[] = [];
    for (let i = 1; i <= 96; i += 1) {
      data.push(this.target);
    }
    return {
      color: colors.error,
      data,
      id: 'target',
      name: 'Target',
      lineWidth: 1,
      type: 'line',
      marker: {
        enabled: false,
      },
      visible: true,
    };
  };
}
