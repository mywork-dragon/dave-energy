export interface EntityDocument {
  id: number;
  key: string;
  value: boolean | number;
}
export interface EntityWrapper {
  data: EntityDocument[];
}
export class EntityModel {
  readonly tableData: EntityDocument[];

  constructor(entityDocument: EntityDocument[]) {
    this.tableData = entityDocument;
  }
}
