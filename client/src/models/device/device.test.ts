import { DeviceDocument, DeviceModel, HistoryModel } from 'models';

describe('DeviceModel', () => {
  it('initializes with a DeviceDocument', () => {
    const deviceDocument: DeviceDocument = {
      building: 1,
      energyType: 'electricity',
      id: 2,
      name: 'HVAC',
      historyData: [
        {
          quantity: 23.3,
          ts: 'mock date',
        },
      ],
      unit: 'kW',
    };

    const deviceModel = new DeviceModel(deviceDocument);
    const { building, energyType, id, name, historyData, unit } = deviceModel;
    expect(building).toBe(1);
    expect(energyType).toBe('electricity');
    expect(id).toBe(2);
    expect(unit).toBe('kW');
    expect(name).toBe('HVAC');
    expect(historyData?.length).toBe(1);
    const firstPoint = historyData?.[0];
    expect(firstPoint instanceof HistoryModel).toBe(true);
    const { quantity, ts } = firstPoint ?? {};
    expect(quantity).toEqual(23.3);
    expect(ts).toBe('mock date');
  });
});
