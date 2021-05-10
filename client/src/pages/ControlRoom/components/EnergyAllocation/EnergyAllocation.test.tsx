import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { EnergyAllocation } from './EnergyAllocation';
import { renderWithRedux } from 'test';
import { EnergyAllocationModel } from 'models';

describe('EnergyAllocation component', () => {
  test('displays expected separate allocation', async () => {
    const allocation: EnergyAllocationModel = new EnergyAllocationModel([
      {
        name: 'HVAC',
        quantity: 60,
      },
      {
        name: 'Lighting',
        quantity: 30,
      },
      {
        name: 'Other',
        quantity: 10,
      },
    ]);

    const { findByTestId } = renderWithRedux(
      <EnergyAllocation allocation={allocation} />,
      {},
    );

    const hvacIcon = await findByTestId('energyAllocation-separate-iconHVAC');
    expect(hvacIcon).toBeInTheDocument();
    const hvacQuantity = await findByTestId(
      'energyAllocation-separate-quantityHVAC',
    );
    expect(hvacQuantity.innerHTML).toEqual('60%');
    const hvacName = await findByTestId('energyAllocation-separate-nameHVAC');
    expect(hvacName.innerHTML).toEqual('HVAC');

    const lightingIcon = await findByTestId(
      'energyAllocation-separate-iconLighting',
    );
    expect(lightingIcon).toBeInTheDocument();
    const lightingQuantity = await findByTestId(
      'energyAllocation-separate-quantityLighting',
    );
    expect(lightingQuantity.innerHTML).toEqual('30%');
    const lightingName = await findByTestId(
      'energyAllocation-separate-nameLighting',
    );
    expect(lightingName.innerHTML).toEqual('Lighting');

    const otherIcon = await findByTestId('energyAllocation-separate-iconOther');
    expect(otherIcon).toBeInTheDocument();
    const otherQuantity = await findByTestId(
      'energyAllocation-separate-quantityOther',
    );
    expect(otherQuantity.innerHTML).toEqual('10%');
    const otherName = await findByTestId('energyAllocation-separate-nameOther');
    expect(otherName.innerHTML).toEqual('Other');
  });

  test('displays expected line allocation', async () => {
    const allocation: EnergyAllocationModel = new EnergyAllocationModel([
      {
        name: 'HVAC',
        quantity: 45,
      },
      {
        name: 'Lighting',
        quantity: 40,
      },
      {
        name: 'Other',
        quantity: 15,
      },
    ]);

    const { findByTestId } = renderWithRedux(
      <EnergyAllocation allocation={allocation} />,
      {},
    );

    const hvacIcon = await findByTestId('energyAllocation-line-iconHVAC');
    expect(hvacIcon).toBeInTheDocument();
    const hvacQuantity = await findByTestId(
      'energyAllocation-line-quantityHVAC',
    );
    expect(hvacQuantity.innerHTML).toEqual('45%');

    const lightingIcon = await findByTestId(
      'energyAllocation-line-iconLighting',
    );
    expect(lightingIcon).toBeInTheDocument();
    const lightingQuantity = await findByTestId(
      'energyAllocation-line-quantityLighting',
    );
    expect(lightingQuantity.innerHTML).toEqual('40%');

    const otherIcon = await findByTestId('energyAllocation-line-iconLighting');
    expect(otherIcon).toBeInTheDocument();
    const otherQuantity = await findByTestId(
      'energyAllocation-line-quantityLighting',
    );
    expect(otherQuantity.innerHTML).toEqual('40%');
  });
});
