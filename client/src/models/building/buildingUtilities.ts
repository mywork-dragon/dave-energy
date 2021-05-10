export interface UtilityDocument {
  readonly id?: number | null;
  readonly name?: string | null;
}

export class UtilityModel {
  public readonly id: number | null;
  public readonly name: string | null;

  constructor(buildingUtilityDocument: UtilityDocument) {
    const { id, name } = buildingUtilityDocument;
    this.id = id ?? null;
    this.name = name ?? null;
  }
}
