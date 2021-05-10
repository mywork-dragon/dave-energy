import React from 'react';
import { SuperAnalyticsTitle } from './types';
import { SuperAnalyticsDetails } from './components/SuperAnalyticsDetails';

export const SuperEnergyConsumptionPage: React.FC = () => {
  return (
    <SuperAnalyticsDetails title={SuperAnalyticsTitle.energyConsumption} />
  );
};
