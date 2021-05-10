import { BillingInformationDocument, BillingInformationModel } from 'models';

describe('BillingInformationModel', () => {
  let billingInformationModel: BillingInformationModel;
  let billingInformationDocument: BillingInformationDocument;
  let fromTimeJSON: string;
  let toDateJSON: string;
  let parsedDate: string;

  beforeEach(() => {
    fromTimeJSON = '2020-08-26T00:00:00.000Z';
    toDateJSON = '2020-08-27T00:00:00.000Z';
    parsedDate = 'AUG 26, 8:00 PM';

    billingInformationDocument = {
      billingCycle: {
        daysLeft: 5,
        fromDate: fromTimeJSON,
        toDate: toDateJSON,
      },
      billingPeak: {
        quantity: 1,
        target: 1,
        targeted: 2,
        ts: 'mock date',
      },
      billingTotal: 100,
      billingDayTotal: 5,
    };
    billingInformationModel = new BillingInformationModel(
      billingInformationDocument,
    );
  });

  it('initializes with a BillingInformationDocument', () => {
    const {
      billingCycle,
      billingPeak,
      billingDayTotal,
      billingTotal,
    } = billingInformationModel;
    expect(billingCycle).toStrictEqual({
      daysLeft: 5,
      fromDate: fromTimeJSON,
      toDate: toDateJSON,
    });
    expect(billingPeak).toStrictEqual({
      quantity: 1,
      target: 1,
      targeted: 2,
      ts: 'mock date',
    });
    expect(billingTotal).toBe(100);
    expect(billingDayTotal).toBe(5);
  });

  it('initializes with fields which equal null', () => {
    const billingInformationDocument = {
      billingCycle: null,
      billingPeak: null,
      billingDayTotal: null,
      billingTotal: null,
    };
    const billingInformationModel = new BillingInformationModel(
      billingInformationDocument,
    );
    const {
      billingCycle,
      billingPeak,
      billingDayTotal,
      billingTotal,
    } = billingInformationModel;
    expect(billingCycle).toBe(null);
    expect(billingPeak).toBe(null);
    expect(billingTotal).toBe(null);
    expect(billingDayTotal).toBe(null);
  });

  describe('getDateDisplay', () => {
    it('returns an empty string if ts equals null', () => {
      const result = billingInformationModel.getDateDisplay(null);
      expect(result).toBe('');
    });

    it('returns parsed date if ts is correct', () => {
      const result = billingInformationModel.getDateDisplay(toDateJSON);
      expect(result).toBe(parsedDate);
    });
  });
});
