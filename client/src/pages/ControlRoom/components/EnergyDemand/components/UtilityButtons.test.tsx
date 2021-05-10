import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { UtilityButtons } from './UtilityButtons';
import { EnergyDemandModel } from 'models';

describe('Utility Buttons', () => {
  it('should render only Electric as the active utility', async () => {
    const demand = new EnergyDemandModel({
      electricity: [],
    });

    const { findByTestId } = render(
      <UtilityButtons demand={demand} activeUtility="electricity" />,
    );

    await findByTestId('historyUtilityButton-electricity-active');
  });

  it('should render Electric / Gas / Steam with Gas as the active utility', async () => {
    const demand = new EnergyDemandModel({
      electricity: [],
      steam: [],
      gas: [],
    });

    const { findByTestId } = render(
      <UtilityButtons demand={demand} activeUtility="gas" />,
    );

    await findByTestId('historyUtilityButton-electricity');
    await findByTestId('historyUtilityButton-gas-active');
    await findByTestId('historyUtilityButton-steam');
  });

  it('should invoke onClick handler when clicking a utility button', async () => {
    const demand = new EnergyDemandModel({
      electricity: [],
      steam: [],
      gas: [],
    });

    const onClickMock = jest.fn();
    const { findByTestId } = render(
      <UtilityButtons
        demand={demand}
        activeUtility="electricity"
        onClick={onClickMock}
      />,
    );

    findByTestId('historyUtilityButton-electricity-active');
    fireEvent(
      await findByTestId('historyUtilityButton-gas'),
      new MouseEvent('click', { bubbles: true }),
    );

    expect(onClickMock).toHaveBeenCalledWith('gas');
  });
});
