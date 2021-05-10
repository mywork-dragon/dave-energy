import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { LegendButtons } from './LegendButtons';
import { EnergyDemandModel, DeviceModel, DeviceName } from 'models';

describe('Legend Buttons', () => {
  it('should only render Meter as the active legend button', async () => {
    const demand = new EnergyDemandModel({
      electricity: [new DeviceModel({ name: 'Meter' })],
    });

    const { findByTestId } = render(
      <LegendButtons
        devices={demand.electricity}
        deviceToVisibleMap={{
          Meter: true,
          HVAC: false,
          Lighting: false,
          Other: false,
          Battery: false,
          Generator: false,
          Solar: false,
        }}
      />,
    );

    await findByTestId('legendButton-meter-active');
  });

  it('should render all legend buttons with Lighting and Generator active', async () => {
    const demand = new EnergyDemandModel({
      electricity: [
        'Meter',
        'HVAC',
        'Lighting',
        'Other',
        'Battery',
        'Generator',
        'Solar',
      ].map(name => new DeviceModel({ name: name as DeviceName })),
    });

    const { findByTestId } = render(
      <LegendButtons
        devices={demand.electricity}
        deviceToVisibleMap={{
          Meter: false,
          HVAC: false,
          Lighting: true,
          Other: false,
          Battery: false,
          Generator: true,
          Solar: false,
        }}
      />,
    );

    await findByTestId('legendButton-meter');
    await findByTestId('legendButton-hvac');
    await findByTestId('legendButton-lighting-active');
    await findByTestId('legendButton-other');
    await findByTestId('legendButton-battery');
    await findByTestId('legendButton-generator-active');
    await findByTestId('legendButton-solar');
  });

  it('should invoke props.setDeviceVisibility upon clicking a legend button', async () => {
    const setDeviceVisibilityStub = jest.fn();
    const demand = new EnergyDemandModel({
      electricity: ['Meter'].map(
        name => new DeviceModel({ name: name as DeviceName }),
      ),
    });

    const { findByTestId } = render(
      <LegendButtons
        devices={demand.electricity}
        deviceToVisibleMap={{
          Meter: true,
          HVAC: false,
          Lighting: true,
          Other: false,
          Battery: false,
          Generator: true,
          Solar: false,
        }}
        setDeviceVisibility={setDeviceVisibilityStub}
      />,
    );

    fireEvent(
      await findByTestId('legendButton-meter-active'),
      new MouseEvent('click', { bubbles: true }),
    );

    expect(setDeviceVisibilityStub).toHaveBeenCalledWith('Meter', false);
  });
});
