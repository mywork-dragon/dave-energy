import { sortBy } from 'lodash';

import { activeBuildingIdParamKeyName } from 'app-constants';
import { BuildingModel } from 'models';


export const formatAssetDropdownOptions = (options: any) => {
    const res = Object.entries(options).reduce((acc: any, [assetKey, deviceMap]: any) => {
    let [assetId, assetName]: any = assetKey.split('_');
    assetId = Number(assetId);

    if (!acc.assets) {
      acc.assets = [];
    }

    acc.assets.push({text: assetName, value: Number(assetId), key: assetKey});

    if (!acc.assetDeviceMap) {
      acc.assetDeviceMap = {};
    }

    Object.entries(deviceMap).forEach(([deviceKey, points]: any) => {
      let [deviceId, deviceName]: any = deviceKey.split('_');
      deviceId = Number(deviceId);

      if (!acc.assetDeviceMap[assetId]) {
        acc.assetDeviceMap[assetId] = [];
      }

      if (!acc.devicePointMap) {
        acc.devicePointMap = {};
      }

      acc.assetDeviceMap[assetId].push({
        text: deviceName,
        value: Number(deviceId),
        key: deviceKey,
      });

      acc.devicePointMap[deviceId] = sortBy(points.map(p => ({
        text: p.point_name,
        value: p.point_id,
        key: `${p.point_id}_${p.point_name}`,
      })), 'text');
    });

    acc.assetDeviceMap[assetId] = sortBy(acc.assetDeviceMap[assetId], 'text');

    return acc;
  }, {});

  res.assets = sortBy(res.assets, 'text');

  return res;
};


export const getActiveBuildingFromUrlParams = (
  buildings: BuildingModel[],
): BuildingModel => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const idParam = urlParams.get(activeBuildingIdParamKeyName);
  const activeBuildingId = idParam ? parseInt(idParam) : null;
  if (activeBuildingId === null || isNaN(activeBuildingId)) {
    return buildings?.[0] ?? null;
  }
  return (
    buildings.find(({ id }) => activeBuildingId === id) ??
    buildings?.[0] ??
    null
  );
};
