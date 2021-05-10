import { BuildingModel } from './../building/building';
import { UserModel, UserDocument } from './user';

type BuildingType = {
  id: number;
  name: string;
  address: string;
};

describe('User model', () => {
  let userModel: UserModel;
  let userDocument: UserDocument;
  let buildingOne: BuildingType;
  let buildingTwo: BuildingType;

  beforeEach(() => {
    buildingOne = {
      id: 1,
      name: 'Building One',
      address: '3000 Atrium Way',
    };

    buildingTwo = {
      id: 2,
      name: 'Building Two',
      address: '241 Water St.',
    };

    userDocument = {
      buildings: [buildingOne, buildingTwo],
      email: 'test@mail.com',
      firstName: 'First',
      id: 1,
      isActive: true,
      lastName: 'Last',
      userRole: 1,
    };
    userModel = new UserModel(userDocument);
  });

  it('initializes with a userDocument', () => {
    const {
      buildings,
      email,
      firstName,
      id,
      isActive,
      lastName,
      userRole,
    } = userModel;

    expect(buildings).toStrictEqual([
      new BuildingModel(buildingOne),
      new BuildingModel(buildingTwo),
    ]);
    expect(email).toBe(userDocument.email);
    expect(firstName).toBe(userDocument.firstName);
    expect(id).toBe(userDocument.id);
    expect(isActive).toBe(userDocument.isActive);
    expect(lastName).toBe(userDocument.lastName);
    expect(userRole).toBe(userDocument.userRole);
  });

  it('initializes with fields which equal null', () => {
    const userDocument = {
      buildings: [buildingOne, buildingTwo],
      email: null,
      firstName: null,
      id: null,
      isActive: null,
      lastName: null,
      userRole: null,
    };

    const userModel = new UserModel(userDocument);
    const {
      buildings,
      email,
      firstName,
      id,
      isActive,
      lastName,
      userRole,
    } = userModel;

    expect(buildings).toStrictEqual([
      new BuildingModel(buildingOne),
      new BuildingModel(buildingTwo),
    ]);
    expect(email).toBe(null);
    expect(firstName).toBe(null);
    expect(id).toBe(null);
    expect(isActive).toBe(null);
    expect(lastName).toBe(null);
    expect(userRole).toBe(null);
  });

  it('returns nothing when there is not userDocument', () => {
    const userModel = new UserModel({});
    expect(userModel.email).toBe(null);
  });

  describe('getAvailableEnergyTypes', () => {
    it('returns available energy type', () => {
      expect(userModel.getAvailableEnergyTypes(buildingOne.id)).toStrictEqual(
        [],
      );
    });
    it('returns an empty array if there is no this.buildings', () => {
      const userModel = new UserModel({});
      const result = userModel.getAvailableEnergyTypes(3);
      expect(result).toStrictEqual([]);
    });
  });
});
