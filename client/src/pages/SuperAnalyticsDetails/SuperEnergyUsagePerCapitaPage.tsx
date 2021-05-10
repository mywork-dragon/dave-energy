import React from 'react';
import { SuperAnalyticsTitle } from './types';
import { SuperAnalyticsDetails } from './components/SuperAnalyticsDetails';

export const SuperEnergyUsagePerCapitaPage: React.FC = () => {
  return (
    <SuperAnalyticsDetails title={SuperAnalyticsTitle.energyUsagePerCapita} />
  );
};
