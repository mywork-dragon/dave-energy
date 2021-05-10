import { parseTime, monthIndexMap } from 'utils';

interface BillingPeakDocument {
  quantity?: number | null;
  target?: number | null;
  targeted?: number | null;
  ts?: string | null;
}

interface BillingCycleDocument {
  readonly daysLeft?: number | null;
  readonly fromDate?: string | null;
  readonly toDate?: string | null;
}

export interface BillingInformationDocument {
  billingCycle?: BillingCycleDocument | null;
  billingCycleSolarTotal?: number | null;
  billingPeak?: BillingPeakDocument | null;
  billingTotal?: number | null;
  billingDayTotal?: number | null;
  todaySolarTotal?: number | null;
  unit?: string | null;
}

export class BillingInformationModel {
  public readonly billingCycle: BillingCycleDocument | null;
  public readonly billingCycleSolarTotal: number | null;
  public readonly billingPeak: BillingPeakDocument | null;
  public readonly billingTotal: number | null;
  public readonly billingDayTotal: number | null;
  public readonly todaySolarTotal: number | null;
  public readonly unit: string | null;

  constructor(billingInformationDocument: BillingInformationDocument) {
    const {
      billingCycle,
      billingCycleSolarTotal,
      billingPeak,
      billingDayTotal,
      billingTotal,
      todaySolarTotal,
      unit,
    } = billingInformationDocument;
    this.billingCycle = billingCycle ?? null;
    this.billingCycleSolarTotal = billingCycleSolarTotal ?? null;
    this.billingPeak = billingPeak ?? null;
    this.billingDayTotal = billingDayTotal ?? null;
    this.billingTotal = billingTotal ?? null;
    this.todaySolarTotal = todaySolarTotal ?? null;
    this.unit = unit ?? null;
  }

  public getDateDisplay = (ts: string | null): string => {
    if (!ts) {
      return '';
    }

    const date = new Date(ts);
    const month = monthIndexMap[date.getMonth()]?.toUpperCase();
    const calDate = date.getDate();
    const [hours, minutes, AMPM] = parseTime(date);

    return `${month} ${calDate}, ${hours}:${minutes} ${AMPM}`;
  };
}
