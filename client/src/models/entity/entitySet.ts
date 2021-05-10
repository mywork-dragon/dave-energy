export interface EntitySetDocument {
  id: number;
  key: string;
  value: boolean | number;
}

export class EntitySetModel {
  readonly entityValues: EntitySetDocument;
  constructor(entityDocument: EntitySetDocument) {
    this.entityValues = entityDocument;
  }
}
