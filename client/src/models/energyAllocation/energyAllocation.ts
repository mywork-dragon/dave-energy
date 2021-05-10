import { DeviceName } from 'models';

export interface EnergyAllocationDocument {
  name?: DeviceName;
  quantity?: number;
}

export class EnergyAllocationModel {
  public readonly allocation: EnergyAllocationDocument[];

  constructor(energyAllocationDocument: EnergyAllocationDocument[]) {
    this.allocation = energyAllocationDocument;
  }
}
