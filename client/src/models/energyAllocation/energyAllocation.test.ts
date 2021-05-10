import {
  EnergyAllocationModel,
  EnergyAllocationDocument,
} from './../energyAllocation/energyAllocation';

describe('EnergyAllocationModel', () => {
  let energyAllocationModel: EnergyAllocationModel;
  let energyAllocationDocumentOne: EnergyAllocationDocument;
  let energyAllocationDocumentTwo: EnergyAllocationDocument;

  beforeEach(() => {
    energyAllocationDocumentOne = {
      name: 'Meter',
      quantity: 1,
    };
    energyAllocationDocumentTwo = {
      name: 'HVAC',
      quantity: 1,
    };
    energyAllocationModel = new EnergyAllocationModel([
      energyAllocationDocumentOne,
      energyAllocationDocumentTwo,
    ]);
  });
  it('renders with EnergyAllocationDocument', () => {
    expect(energyAllocationModel.allocation).toStrictEqual([
      energyAllocationDocumentOne,
      energyAllocationDocumentTwo,
    ]);
  });
});
