import { SeriesLineOptions, PointOptionsObject } from 'highcharts';

import { colors } from 'design-system';
import './styles.less';

export interface GreenhouseGasEmissionDocument {
  readonly monthDisplay?: string | null;
  readonly monthNumber?: number | null;
  readonly percentage?: number | null;
  readonly quantity?: number | null;
  readonly unit?: string | null;
}

export class GreenhouseGasEmissionModel {
  public readonly monthDisplay: string | null;
  public readonly monthNumber: number | null;
  public readonly percentage: number | null;
  public readonly quantity: number | null;
  public readonly unit: string | null;

  constructor(greenhouseGasEmissionDocument: GreenhouseGasEmissionDocument) {
    const {
      monthDisplay,
      monthNumber,
      percentage,
      quantity,
      unit,
    } = greenhouseGasEmissionDocument;
    this.monthDisplay = monthDisplay ?? null;
    this.monthNumber = monthNumber ?? null;
    this.percentage = percentage ?? null;
    this.quantity = quantity ?? null;
    this.unit = unit ?? null;
  }

  public static getGreenhouseGasEmissionByMonth = (
    emissions: GreenhouseGasEmissionModel[],
    month: number,
  ): GreenhouseGasEmissionModel | null =>
    emissions.find(emission => emission.monthNumber === month) ?? null;

  public static generateSeriesLineOptions(
    emissions: GreenhouseGasEmissionModel[],
  ): SeriesLineOptions {
    return {
      color: colors.blue,
      data: emissions.map(
        emission =>
          ({
            y:
              emission.quantity === 0 || emission.quantity === null
                ? null
                : Number(emission.quantity?.toFixed(1)),
            change: emission.getPercentageDisplay(),
            dataLabels: {
              color: emission.getPercentageColor(),
              className: 'emissions-highcharts-change',
              enabled: emission.percentage === 0 ? false : true,
              format: '{point.change}',
              padding: 15,
            },
          } as PointOptionsObject),
      ),
      lineWidth: 4,
      id: 'Electricity',
      name: 'Electricity',
      type: 'line',
    };
  }

  public getQuantityDisplay = (): string =>
    Number(this.quantity?.toFixed(1) ?? 0).toLocaleString('en');

  public getPercentageDisplay = (): string => {
    if (this.percentage === null || this.percentage === 0) {
      return '+/- 0%';
    } else if (this.percentage < 0) {
      return `- ${-1 * this.percentage}%`;
    } else {
      return `+ ${this.percentage}%`;
    }
  };

  public getPercentageColor = (): string => {
    if (this.percentage === null || this.percentage === 0) {
      return colors.blue;
    } else if (this.percentage < 0) {
      return colors.green;
    } else {
      return colors.error;
    }
  };
}
