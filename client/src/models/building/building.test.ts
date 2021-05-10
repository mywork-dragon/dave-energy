import { DeviceModel } from 'models';
import { BuildingModel, BuildingDocument } from './building';
describe('Building model', () => {
  it('initializes with a userDocument', () => {
    const mockedDevicesOne: DeviceModel = new DeviceModel({
      building: 1,
      energyType: 'electricity',
      id: 1,
      name: 'Battery',
      historyData: [
        {
          mode: 'mode1',
          quantity: 1,
          ts: 'ts-mock1',
        },
        {
          mode: 'mode2',
          quantity: 2,
          ts: 'ts-mock2',
        },
      ],
      unit: 'W',
    });
    const mockedDevicesTwo: DeviceModel = new DeviceModel({
      building: 2,
      energyType: 'gas',
      id: 2,
      name: 'Generator',
      historyData: [
        {
          mode: 'mode1',
          quantity: 1,
          ts: 'ts-mock1',
        },
        {
          mode: 'mode2',
          quantity: 2,
          ts: 'ts-mock2',
        },
      ],
      unit: 'kW',
    });

    const buildingDocument: BuildingDocument = {
      address: 'address-mock',
      client: 'client-mock',
      devices: [mockedDevicesOne, mockedDevicesTwo],
      id: 1,
      market: 'market-mock',
      name: 'name-mock',
      sqFootage: 1,
      user: 1,
      utility: 'steam',
    };

    const buildingModel: BuildingModel = new BuildingModel(buildingDocument);

    const {
      address,
      client,
      devices,
      id,
      market,
      name,
      sqFootage,
      user,
      utility,
    } = buildingModel;

    expect(address).toBe('address-mock');
    expect(client).toBe('client-mock');
    expect(devices).toStrictEqual(devices);
    expect(id).toBe(1);
    expect(market).toBe('market-mock');
    expect(sqFootage).toBe(1);
    expect(user).toBe(1);
    expect(name).toBe('name-mock');
    expect(utility).toBe('steam');
  });

  it('initializes with the userDocument fields equal null', () => {
    const buildingDocument: BuildingDocument = {
      address: null,
      client: null,
      devices: null,
      id: null,
      market: null,
      name: null,
      sqFootage: null,
      user: null,
      utility: null,
    };

    const buildingModel: BuildingModel = new BuildingModel(buildingDocument);

    const {
      address,
      client,
      devices,
      id,
      market,
      name,
      sqFootage,
      user,
      utility,
    } = buildingModel;

    expect(address).toBeNull();
    expect(client).toBeNull();
    expect(devices).toBeNull();
    expect(id).toBeNull();
    expect(market).toBeNull();
    expect(sqFootage).toBeNull();
    expect(user).toBeNull();
    expect(name).toBeNull();
    expect(utility).toBeNull();
  });
});
