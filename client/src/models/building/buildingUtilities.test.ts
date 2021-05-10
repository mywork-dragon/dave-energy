import { UtilityDocument, UtilityModel } from './buildingUtilities';
describe('buildingUtilities model', () => {
  it('renders with a Utility Document', () => {
    const utilityDocument: UtilityDocument = {
      id: 1,
      name: 'mocked-name',
    };

    const utilityModel: UtilityModel = new UtilityModel(utilityDocument);

    const { id, name } = utilityModel;

    expect(id).toBe(1);
    expect(name).toBe('mocked-name');
  });
  it('renders with a Utility Document fields qual null', () => {
    const utilityDocument: UtilityDocument = {
      id: null,
      name: null,
    };

    const utilityModel: UtilityModel = new UtilityModel(utilityDocument);

    const { id, name } = utilityModel;

    expect(id).toBeNull();
    expect(name).toBeNull();
  });
});
