import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router';

import { SessionRoute } from './SessionRoute';
import {
  AnalyticsPage,
  ControlRoomPage,
  LoginPage,
  RegisterPage,
  SuperAnalyticsPage,
  SustainabilityPage,
  EntityPage,
  AssetsPage,
  SuperEnergyDemandPage,
  SuperCostsAndSavingsPage,
  SuperEnergyConsumptionPage,
  SuperEnergyUsagePerCapitaPage,
  SuperEnergyCostPerCapitaPage,
  BuildingEngineerAnnualExportPage,
  BuildingEngineerEnergyConsumptionPage,
  BuildingEngineerEnergyDemandPage,
  BuildingEngineerSolarGenerationPage,
} from 'pages';
import { getUser } from 'store/user';
import { RootState } from 'store';
import { UserRole } from 'models';

export const RoutePaths = {
  analytics: '/analytics',
  annualExport: '/analytics/annual-export',
  energyConsumptionAnalytics: '/analytics/energy-consumption',
  energyDemandAnalytics: '/analytics/energy-demand',
  solarGenerationAnalytics: '/analytics/solar-generation',
  assetsAnalytics: '/analytics/assets',
  superAnalyticsCostsAndSaving: '/analytics/super-costs-and-savings',
  superAnalyticsEnergyDemand: '/analytics/super-energy-demand',
  superAnalyticsEnergyConsumption: '/analytics/super-energy-consumption',
  superAnalyticsEnergyUsagePerCapita: '/analytics/super-energy-usage-per-capita',
  superAnalyticsEnergyCostPerCapita: '/analytics/super-energy-cost-per-capita',
  controlRoom: '/control-room',
  entity: '/entity',
  login: '/login',
  register: '/register',
  sustainability: '/sustainability',
  user: '/user',
};

export const Routes = () => {
  const user = useSelector((state: RootState) => state.user?.instance);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const analyticsPageBasedOnUserRole = () => {
    switch (user?.userRole) {
      case UserRole.MANAGEMENT:
        return SuperAnalyticsPage;
      case UserRole.STANDARD:
      case UserRole.ADMIN:
      case UserRole.BUILDING_ENGINEER:
      default:
        return AnalyticsPage;
    }
  };

  return (
    <Switch>
      <Route path={RoutePaths.login} component={LoginPage} />
      <Route path={RoutePaths.register} component={RegisterPage} />
      <SessionRoute
        path={RoutePaths.annualExport}
        component={BuildingEngineerAnnualExportPage}
      />
      <SessionRoute
        path={RoutePaths.energyConsumptionAnalytics}
        component={BuildingEngineerEnergyConsumptionPage}
      />
      <SessionRoute
        path={RoutePaths.energyDemandAnalytics}
        component={BuildingEngineerEnergyDemandPage}
      />
      <SessionRoute
        path={RoutePaths.solarGenerationAnalytics}
        component={BuildingEngineerSolarGenerationPage}
      />
      <SessionRoute path={RoutePaths.assetsAnalytics} component={AssetsPage} />
      <SessionRoute
        path={RoutePaths.superAnalyticsCostsAndSaving}
        component={SuperCostsAndSavingsPage}
      />
      <SessionRoute
        path={RoutePaths.superAnalyticsEnergyDemand}
        component={SuperEnergyDemandPage}
      />
      <SessionRoute
        path={RoutePaths.superAnalyticsEnergyConsumption}
        component={SuperEnergyConsumptionPage}
      />
      <SessionRoute
        path={RoutePaths.superAnalyticsEnergyUsagePerCapita}
        component={SuperEnergyUsagePerCapitaPage}
      />
      <SessionRoute
        path={RoutePaths.superAnalyticsEnergyCostPerCapita}
        component={SuperEnergyCostPerCapitaPage}
      />
      {/* Root /analytics must be under /analytics/CHILD_ROUTE */}
      <SessionRoute
        path={RoutePaths.analytics}
        component={analyticsPageBasedOnUserRole()}
      />
      {/* TODO: Find out how to redirect these if the user doesn't have role
          UserRole.ADMIN. There aren't any links in the app to route directory
          so this will work for now.
      */}
      <SessionRoute path="/analytics-cfo" component={SuperAnalyticsPage} />
      <SessionRoute path="/analytics-engineer" component={AnalyticsPage} />
      <SessionRoute path={RoutePaths.controlRoom} component={ControlRoomPage} />
      <SessionRoute path={RoutePaths.entity} component={EntityPage} />
      <SessionRoute
        path={RoutePaths.sustainability}
        component={SustainabilityPage}
      />
      <Route path="*">
        <Redirect to="/control-room" />
      </Route>
    </Switch>
  );
};
