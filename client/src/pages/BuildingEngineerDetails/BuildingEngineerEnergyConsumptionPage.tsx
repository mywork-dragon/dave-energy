import React from 'react';

import { BuildingEngineerDetailsPage } from './components';
import { EngineerAnalyticsTitle } from 'components/EngineerAnalytics';

export const BuildingEngineerEnergyConsumptionPage = () => (
  <BuildingEngineerDetailsPage
    title={EngineerAnalyticsTitle.energyConsumption}
  />
);
