export interface BuildingEngineerAnalyticsDocument {
  monthDisplay?: string | null;
  monthNumber?: number | null;
  quantity?: number | null;
  unit?: string | null;
}

export class BuildingEngineerAnalyticsModel {
  public readonly monthDisplay: string | null;
  public readonly monthNumber: number | null;
  public readonly quantity: number | null;
  public readonly unit: string | null;

  constructor(
    buildingEngineerAnalyticsDocument: BuildingEngineerAnalyticsDocument,
  ) {
    const {
      monthDisplay,
      monthNumber,
      quantity,
      unit,
    } = buildingEngineerAnalyticsDocument;
    this.monthDisplay = monthDisplay ?? null;
    this.monthNumber = monthNumber ?? null;
    this.quantity = quantity ?? null;
    this.unit = unit ?? null;
  }
}
