export interface UtilityDocument {
  readonly id?: number | null;
  readonly name?: string | null;
}

export class UtilityModel {
  public readonly id: number | null;
  public readonly name: string | null;

  constructor(utilityDocument: UtilityDocument) {
    const { id, name } = utilityDocument;
    this.id = id ?? null;
    this.name = name ?? null;
  }
}
