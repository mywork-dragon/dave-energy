import { SeriesColumnOptions } from 'highcharts';
import { colors } from 'design-system';

export interface EnergyConsumptionYearDocument {
  readonly [key: number]: number;
}

export interface EnergyConsumptionYearComparisonDocument {
  readonly [key: number]: EnergyConsumptionYearDocument;
  readonly unit: string;
}

export class EnergyConsumptionYearComparisonModel {
  public static readonly year1SeriesId = 'year-1';
  public static readonly year2SeriesId = 'year-2';
  public readonly year1: number;
  public readonly year2: number;
  public readonly year1Comparison: number[] | null;
  public readonly year2Comparison: number[] | null;
  public readonly unit: string;

  constructor(
    year1: number,
    year2: number,
    document: EnergyConsumptionYearComparisonDocument,
    unit: string,
  ) {
    this.year1 = year1;
    this.year1Comparison = this.massageObjectIntoArray(document[year1]);
    this.year2 = year2;
    this.year2Comparison = this.massageObjectIntoArray(document[year2]);
    this.unit = unit ?? 'kW';
  }

  /*
    Param
    {
      1: number1,
      2: number2,
      3: number3,
      ...
    }
    Returns
    [
      number1,
      number2,
      number3,
      ...
    ]
  */
  private massageObjectIntoArray = (
    rawEnergyConsumptionYearDocument: EnergyConsumptionYearDocument,
  ): number[] => {
    const keys = Object.keys(rawEnergyConsumptionYearDocument)
      .map(monthNumber => Number(monthNumber))
      .sort((a, b) => a - b);
    return keys.reduce((accumulator, month) => {
      accumulator.push(rawEnergyConsumptionYearDocument[month]);
      return accumulator;
    }, [] as number[]);
  };

  public generateYear1SeriesBarOptions = (): SeriesColumnOptions => ({
    type: 'column',
    id: EnergyConsumptionYearComparisonModel.year1SeriesId,
    name: this.year1.toString(),
    color: colors.blue,
    borderColor: colors.blue,
    data: this.year1Comparison?.map(quantity => quantity ?? 0) ?? [],
  });

  public generateYear2SeriesBarOptions = (): SeriesColumnOptions => ({
    type: 'column',
    id: EnergyConsumptionYearComparisonModel.year2SeriesId,
    name: this.year2.toString(),
    color: colors.hvac,
    borderColor: colors.hvac,
    data: this.year2Comparison?.map(quantity => quantity ?? 0) ?? [],
  });
}
