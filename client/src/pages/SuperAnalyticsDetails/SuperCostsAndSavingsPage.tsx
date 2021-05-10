import React from 'react';
import { SuperAnalyticsTitle } from './types';
import { SuperAnalyticsDetails } from './components/SuperAnalyticsDetails';

export const SuperCostsAndSavingsPage: React.FC = () => {
  return <SuperAnalyticsDetails title={SuperAnalyticsTitle.costsAndSavings} />;
};
