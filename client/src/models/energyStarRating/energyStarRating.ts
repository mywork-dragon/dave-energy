import { SeriesAreaOptions } from 'highcharts';
import { colors } from 'design-system';

export interface EnergyStarRatingDocument {
  readonly change?: number | null;
  readonly month?: number | null;
  readonly monthDisplay?: string | null;
  readonly value?: number | null;
}

export class EnergyStarRatingModel {
  public readonly change: number | null;
  public readonly month: number | null;
  public readonly monthDisplay: string | null;
  public readonly value: number | null;

  constructor(energyStarRatingDocument: EnergyStarRatingDocument) {
    const { change, month, monthDisplay, value } = energyStarRatingDocument;
    this.change = change ?? null;
    this.month = month ?? null;
    this.monthDisplay = monthDisplay ?? null;
    this.value = value ?? null;
  }

  public static getEnergyStarRatingByMonth = (
    energyStarRatings: EnergyStarRatingModel[],
    month: number,
  ): EnergyStarRatingModel | null =>
    energyStarRatings.find(
      energyStarRating => energyStarRating?.month === month,
    ) ?? null;

  public static generateSeriesAreaOptions = (
    energyStarRatings: EnergyStarRatingModel[],
  ): SeriesAreaOptions => ({
    color: colors.blue,
    data: energyStarRatings.map(({ value }) => (value === 0 ? null : value)),
    lineWidth: 4,
    marker: {
      enabled: false,
    },
    name: 'Energy Star Score',
    type: 'area',
  });

  public getValueColor(): string {
    if (this.value === null) {
      return colors.blue;
    } else if (this.value > 74) {
      return colors.green;
    } else if (this.value > 25) {
      return colors.yellow;
    } else {
      return colors.error;
    }
  }

  public getChangeDisplay(): string {
    if (this.change === null || this.change === 0) {
      return '+/- 0 pts';
    } else if (this.change < 0) {
      return `- ${-1 * this.change} pts`;
    } else {
      return `+ ${this.change} pts`;
    }
  }

  public getChangeColor(): string {
    if (this.change === null || this.change === 0) {
      return colors.blue;
    } else if (this.change < 0) {
      return colors.error;
    } else {
      return colors.green;
    }
  }
}
