export interface ElectricityDocument {
  lastBilling?: {
    pctChange?: string | null;
    unit?: string | null;
    value?: string | null;
  };
  ytd?: {
    pctChange?: string | null;
    unit?: string | null;
    value?: string | null;
  };
}

export interface AnalyticsSuperDocument {
  electricity?: ElectricityDocument | null;
}

export class AnalyticsSuperModel {
  public readonly electricity: ElectricityDocument | null;

  constructor(analyticsSuperDocument: AnalyticsSuperDocument) {
    const { electricity } = analyticsSuperDocument;
    this.electricity = electricity ?? null;
  }
}
