import { UtilityModel, UtilityDocument } from 'models';

describe('UtilityModel', () => {
  let utilityModel: UtilityModel;
  let utilityDocument: UtilityDocument;

  beforeEach(() => {
    utilityDocument = {
      id: 1,
      name: 'mock-name',
    };

    utilityModel = new UtilityModel(utilityDocument);
  });

  it('renders with UtilityDocument', () => {
    const { id, name } = utilityDocument;
    expect(id).toBe(utilityDocument.id);
    expect(name).toBe(utilityDocument.name);
  });

  it('renders if utilityDocument fields equal null', () => {
    const utilityDocument = {
      id: null,
      name: null,
    };
    utilityModel = new UtilityModel(utilityDocument);

    const { id, name } = utilityModel;
    expect(id).toBeNull();
    expect(name).toBeNull();
  });
});
