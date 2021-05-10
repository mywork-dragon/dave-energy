import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BillingPeak } from './BillingPeak';
import { BillingInformationModel, BillingInformationDocument } from 'models';

describe('BillingPeak components', () => {
  test('should render nothing if props.billingInformation is null', async () => {
    const { container } = render(<BillingPeak billingInformation={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('should render nothing if props.assets is an empty array', async () => {
    const billingInformationDocument: BillingInformationDocument = {
      billingCycle: null,
      billingPeak: null,
      billingTotal: null,
      billingDayTotal: null,
    };
    const billingInformationModel: BillingInformationModel = new BillingInformationModel(
      billingInformationDocument,
    );

    const { container } = render(
      <BillingPeak billingInformation={billingInformationModel} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('should render billingInformationDocument', async () => {
    const billingInformationDocument: BillingInformationDocument = {
      billingCycle: {
        daysLeft: 1,
        fromDate: 'mocked-from',
        toDate: 'mocked-to',
      },
      billingPeak: {
        quantity: 1,
        target: 1,
        targeted: 1,
        ts: 'mocked-ts',
      },
      billingTotal: 1,
      billingDayTotal: 1,
    };
    const billingInformationModel: BillingInformationModel = new BillingInformationModel(
      billingInformationDocument,
    );

    const { findByTestId } = render(
      <BillingPeak billingInformation={billingInformationModel} />,
    );
    const billingPeakQuantity = await findByTestId('billingPeak-quantity');
    expect(billingPeakQuantity).toBeInTheDocument();
    expect(billingPeakQuantity.innerHTML).toEqual('1');

    const billingPeakDateDisplay = await findByTestId(
      'billingPeak-date-display',
    );
    expect(billingPeakDateDisplay).toBeInTheDocument();
    expect(billingPeakDateDisplay.innerHTML).toEqual(
      billingInformationModel.getDateDisplay('mocked-ts'),
    );
  });
  test('should render without quantity, target and targeted < 0', async () => {
    const billingInformationDocument: BillingInformationDocument = {
      billingCycle: {
        daysLeft: 1,
        fromDate: 'mocked-from',
        toDate: 'mocked-to',
      },
      billingPeak: {
        quantity: null,
        target: null,
        targeted: -1,
        ts: 'mocked-ts',
      },
      billingTotal: 1,
      billingDayTotal: 1,
    };
    const billingInformationModel: BillingInformationModel = new BillingInformationModel(
      billingInformationDocument,
    );

    const { findByTestId } = render(
      <BillingPeak billingInformation={billingInformationModel} />,
    );
    const billingPeakQuantity = await findByTestId('billingPeak-quantity');
    expect(billingPeakQuantity).toBeInTheDocument();

    const billingPeakDateDisplay = await findByTestId(
      'billingPeak-date-display',
    );
    expect(billingPeakDateDisplay).toBeInTheDocument();
  });
});
