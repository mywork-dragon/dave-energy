import { colors } from 'design-system';
import { SeriesColumnOptions } from 'highcharts';

interface ChartYearDocument {
  label?: string | null;
  value?: string | number | null;
  unit?: string | null;
  year?: number;
}

interface ChartYear {
  label: string | null;
  value: string | null;
  unit: string | null;
  year?: number;
}

interface MonthAndValueDocument {
  monthName?: string | null;
  currYear?: number | null;
  lastYear?: number | null;
}

interface ElectricityDocument {
  lastYear?: ChartYearDocument | null;
  currentYear?: ChartYearDocument | null;
  pctChange?: string | null;
  monthAndValues?: MonthAndValueDocument[] | null;
}

interface ChartElectricity {
  lastYear: ChartYear | null;
  currentYear: ChartYear | null;
  pctChange: string | null;
  monthAndValues: MonthAndValueDocument[] | null;
}

export interface SuperAnalyticsChartDocument {
  electricity?: ElectricityDocument | null;
}

export class SuperAnalyticsChartModel {
  public static readonly lastYearSeriesId = 'year-last';
  public static readonly currentYearSeriesId = 'year-current';
  public static readonly lastYearSeriesName = 'Last Year';
  public static readonly currentYearSeriesName = 'Current Year';
  public readonly electricity: ChartElectricity | null;

  constructor(chartCostsAndSavingsDocument: SuperAnalyticsChartDocument) {
    const { electricity } = chartCostsAndSavingsDocument;

    this.electricity = this.initializeElectricity(electricity);
  }

  private stringifyValue(value?: number | string | null) {
    return typeof value === 'number' ? value.toLocaleString('en-US') : value;
  }

  private initializeYear(
    yearDocumnt?: ChartYearDocument | null,
  ): ChartYear | null {
    if (!yearDocumnt) {
      return null;
    }
    const { label, value, unit, year } = yearDocumnt;

    return {
      label: label ?? null,
      value: this.stringifyValue(value) ?? null,
      unit: unit ?? null,
      year,
    };
  }

  private initializeElectricity(
    electricity?: ElectricityDocument | null,
  ): ChartElectricity | null {
    if (!electricity) {
      return null;
    }
    const { lastYear, currentYear, pctChange, monthAndValues } = electricity;
    return {
      lastYear: this.initializeYear(lastYear),
      currentYear: this.initializeYear(currentYear),
      pctChange: pctChange ?? null,
      monthAndValues: monthAndValues ?? null,
    };
  }

  private generateSeriesData(
    fullMonthAndValues: MonthAndValueDocument[],
    year: 'lastYear' | 'currYear',
  ): number[] {
    return (
      fullMonthAndValues?.map(monthAndValue => monthAndValue?.[year] ?? 0) ?? []
    );
  }

  public generateLastYearSeriesBarOptions = (): SeriesColumnOptions => {
    return {
      type: 'column',
      id: SuperAnalyticsChartModel.lastYearSeriesId,
      name: SuperAnalyticsChartModel.lastYearSeriesName,
      color: colors.hvac,
      borderColor: colors.hvac,
      data: this.generateSeriesData(
        this.electricity?.monthAndValues ?? [],
        'lastYear',
      ),
    };
  };

  public generateCurrentYearSeriesBarOptions = (): SeriesColumnOptions => {
    return {
      type: 'column',
      id: SuperAnalyticsChartModel.currentYearSeriesId,
      name: SuperAnalyticsChartModel.currentYearSeriesName,
      color: colors.blue,
      borderColor: colors.blue,
      data: this.generateSeriesData(
        this.electricity?.monthAndValues ?? [],
        'currYear',
      ),
    };
  };
}
