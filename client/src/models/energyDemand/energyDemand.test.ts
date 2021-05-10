// TODO: Fix tests once API has been  sorted out
// import { DeviceModel, EnergyDemandModel } from 'models';

describe('EnergyDemandModel', () => {
  // let energyDemandModel: EnergyDemandModel;

  beforeEach(() => {
    // energyDemandModel = new HistoryModel({
    //   electric: [
    //     {
    //       energyType: 'electric',
    //       id: 2,
    //       name: 'HVAC',
    //       unit: 'kwh',
    //       points: [
    //         {
    //           quantity: 23.5,
    //           ts: 'ts mock',
    //         },
    //       ],
    //     },
    //   ],
    // });
  });

  describe('constructor method', () => {
    it('should initialize with a HistoryDocument', () => {
      //   expect(Array.isArray(energyDemandModel.electric)).toBe(true);
      //   const electricDevices = energyDemandModel.electric;
      //   const firstElectricDevice = energyDemandModel.electric?.[0];
      //   expect(Array.isArray(electricDevices)).toBe(true);
      //   expect(electricDevices?.length).toBe(1);
      //   expect(firstElectricDevice instanceof DeviceModel).toBe(true);
      //   const { energyType, name, unit } = firstElectricDevice!;
      //   expect({
      //     energyType,
      //     name,
      //     unit,
      //   }).toStrictEqual({
      //     energyType: 'electric',
      //     name: 'HVAC',
      //     unit: 'kwh',
      //   });
    });
  });

  describe('getDevicesByEnergyType method', () => {
    it('should return DeviceModel[]', () => {
      //   const devices = energyDemandModel.getDevicesByEnergyType('electric');
      //   expect(devices.length).toBe(1);
      //   expect(devices[0] instanceof DeviceModel).toBe(true);
    });
  });

  describe('generateSeriesBarOptionsForEnergyType', () => {
    it('should return SeriesBarOptions[]', () => {
      //     const seriesBarOptions = energyDemandModel.generateSeriesBarOptionsForEnergyType(
      //       'electric',
      //     );
      //     expect(seriesBarOptions).toStrictEqual([
      //       {
      //         data: [23.5],
      //         id: '2',
      //         name: 'HVAC',
      //         type: 'bar',
      //       },
      //     ]);
    });
  });
});
