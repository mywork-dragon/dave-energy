import { DeviceDocument, HistoryDocument, DeviceName, WattUnit } from 'models';

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a /building/${id}?utility=${utility} stub for a specific utility
 */
export function generateDeviceDocumentStub(
  deviceName: DeviceName,
  unit: WattUnit,
  isNegative = false,
): DeviceDocument {
  const fifteenMinuteTicks = 4 * 24; // Four 15-minute intervals * 24 hours
  const historyData: HistoryDocument[] = [];

  for (
    let tickCounter = 0;
    tickCounter < fifteenMinuteTicks;
    tickCounter += 1
  ) {
    const startDate = new Date(2020, 5, 0, 0, 0, 0, 0);
    startDate.setUTCHours(0);
    startDate.setUTCMinutes(startDate.getUTCMinutes() + tickCounter * 15);
    const historyDataPoint: HistoryDocument = {
      quantity: isNegative
        ? getRandomArbitrary(-300, 0)
        : getRandomArbitrary(300, 600),
      ts: startDate.toJSON(),
    };
    historyData.push(historyDataPoint);
  }

  return {
    name: deviceName,
    historyData,
    unit,
  };
}
