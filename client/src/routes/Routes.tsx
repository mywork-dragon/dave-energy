import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
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

export const RoutePaths = {
  analyticsEngineer: '/analytics-engineer',
  analyticsEngineerAnnualExport: '/analytics-engineer/annual-export',
  analyticsEngineerAssets: '/analytics-engineer/assets',
  analyticsEngineerEnergyConsumption: '/analytics-engineer/energy-consumption',
  analyticsEngineerEnergyDemand: '/analytics-engineer/energy-demand',
  analyticsEngineerSolarGeneration: '/analytics-engineer/solar-generation',
  analyticsManagement: '/analytics-management',
  analyticsManagementCostsAndSaving: '/analytics-management/costs-and-savings',
  analyticsManagementEnergyConsumption: '/analytics-management/energy-consumption',
  analyticsManagementEnergyCostPerCapita: '/analytics-management/energy-cost-per-capita',
  analyticsManagementEnergyDemand: '/analytics-management/energy-demand',
  analyticsManagementEnergyUsagePerCapita: '/analytics-management/energy-usage-per-capita',
  controlRoom: '/control-room',
  entity: '/entity',
  login: '/login',
  register: '/register',
  sustainability: '/sustainability',
  user: '/user',
};

export const Routes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <Switch>
      <Route path={RoutePaths.login} component={LoginPage} />
      <Route path={RoutePaths.register} component={RegisterPage} />
      <SessionRoute
        path={RoutePaths.analyticsEngineerAnnualExport}
        component={BuildingEngineerAnnualExportPage}
      />
      <SessionRoute
        path={RoutePaths.analyticsEngineerEnergyConsumption}
        component={BuildingEngineerEnergyConsumptionPage}
      />
      <SessionRoute
        path={RoutePaths.analyticsEngineerEnergyDemand}
        component={BuildingEngineerEnergyDemandPage}
      />
      <SessionRoute
        path={RoutePaths.analyticsEngineerSolarGeneration}
        component={BuildingEngineerSolarGenerationPage}
      />
      <SessionRoute path={RoutePaths.analyticsEngineerAssets} component={AssetsPage} />
      <SessionRoute
        path={RoutePaths.analyticsManagementCostsAndSaving}
        component={SuperCostsAndSavingsPage}
      />
      <SessionRoute
        path={RoutePaths.analyticsManagementEnergyDemand}
        component={SuperEnergyDemandPage}
      />
      <SessionRoute
        path={RoutePaths.analyticsManagementEnergyConsumption}
        component={SuperEnergyConsumptionPage}
      />
      <SessionRoute
        path={RoutePaths.analyticsManagementEnergyUsagePerCapita}
        component={SuperEnergyUsagePerCapitaPage}
      />
      <SessionRoute
        path={RoutePaths.analyticsManagementEnergyCostPerCapita}
        component={SuperEnergyCostPerCapitaPage}
      />
      <SessionRoute path={RoutePaths.analyticsEngineer} component={AnalyticsPage} />
      <SessionRoute path={RoutePaths.analyticsManagement} component={SuperAnalyticsPage} />
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
