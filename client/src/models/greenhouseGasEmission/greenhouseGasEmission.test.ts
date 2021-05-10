import { colors } from 'design-system';
import {
  GreenhouseGasEmissionDocument,
  GreenhouseGasEmissionModel,
} from './greenhouseGasEmission';

const greenhouseGasEmissionDocument: GreenhouseGasEmissionDocument = {
  monthDisplay: 'mocked-month',
  monthNumber: 1,
  quantity: 1,
  percentage: 0,
  unit: 'mocked-unit',
};
const greenhouseGasEmissionDocumentTwo: GreenhouseGasEmissionDocument = {
  monthDisplay: 'mocked-month2',
  monthNumber: 2,
  quantity: 0,
  percentage: 5,
  unit: 'mocked-unit2',
};
const greenhouseGasEmissionDocumentThree: GreenhouseGasEmissionDocument = {
  monthDisplay: 'mocked-month3',
  monthNumber: 2,
  quantity: null,
  percentage: -2,
  unit: 'mocked-unit3',
};

describe('greenhouseGasEmission model', () => {
  it('renders with a GreenhouseGasEmissionDocument', () => {
    const greenhouseGasEmissionModel: GreenhouseGasEmissionModel = new GreenhouseGasEmissionModel(
      greenhouseGasEmissionDocument,
    );

    const {
      monthDisplay,
      monthNumber,
      quantity,
      unit,
    } = greenhouseGasEmissionModel;

    expect(monthDisplay).toBe('mocked-month');
    expect(monthNumber).toBe(1);
    expect(quantity).toBe(1);
    expect(unit).toBe('mocked-unit');
  });
  it('renders with GreenhouseGasEmissionDocument fields equal null', () => {
    const greenhouseGasEmissionDocument: GreenhouseGasEmissionDocument = {
      monthDisplay: null,
      monthNumber: null,
      quantity: null,
      unit: null,
    };

    const greenhouseGasEmissionModel: GreenhouseGasEmissionModel = new GreenhouseGasEmissionModel(
      greenhouseGasEmissionDocument,
    );

    const {
      monthDisplay,
      monthNumber,
      quantity,
      unit,
    } = greenhouseGasEmissionModel;

    expect(monthDisplay).toBeNull();
    expect(monthNumber).toBeNull();
    expect(quantity).toBeNull();
    expect(unit).toBeNull();
  });

  describe('generateSeriesLineOptions', () => {
    it('returns correct series line options', () => {
      const greenhouseGasEmissionModel: GreenhouseGasEmissionModel = new GreenhouseGasEmissionModel(
        greenhouseGasEmissionDocument,
      );
      const greenhouseGasEmissionModelTwo: GreenhouseGasEmissionModel = new GreenhouseGasEmissionModel(
        greenhouseGasEmissionDocumentTwo,
      );
      const greenhouseGasEmissionModelThree: GreenhouseGasEmissionModel = new GreenhouseGasEmissionModel(
        greenhouseGasEmissionDocumentThree,
      );

      const emissions = [
        greenhouseGasEmissionModel,
        greenhouseGasEmissionModelTwo,
        greenhouseGasEmissionModelThree,
      ];

      const {
        color,
        data,
        lineWidth,
        name,
        type,
      } = GreenhouseGasEmissionModel.generateSeriesLineOptions(emissions);

      expect(color).toBe(colors.blue);
      expect(data).toStrictEqual([
        {
          change: '+/- 0%',
          dataLabels: {
            className: 'emissions-highcharts-change',
            color: '#002361',
            enabled: false,
            format: '{point.change}',
            padding: 15,
          },
          y: 1,
        },
        {
          change: '+ 5%',
          dataLabels: {
            className: 'emissions-highcharts-change',
            color: '#FD6464',
            enabled: true,
            format: '{point.change}',
            padding: 15,
          },
          y: null,
        },
        {
          change: '- 2%',
          dataLabels: {
            className: 'emissions-highcharts-change',
            color: '#23C45D',
            enabled: true,
            format: '{point.change}',
            padding: 15,
          },
          y: null,
        },
      ]);
      expect(lineWidth).toBe(4);
      expect(name).toBe('Electricity');
      expect(type).toBe('line');
    });
  });

  it('should initialize with data', () => {
    const model = new GreenhouseGasEmissionModel({
      monthDisplay: 'J',
      monthNumber: 6,
      percentage: 2.1,
      quantity: 23.4,
      unit: 'tCO2e',
    });
    expect(model).toBeInstanceOf(GreenhouseGasEmissionModel);
    const { monthDisplay, monthNumber, percentage, quantity, unit } = model;
    expect(monthDisplay).toEqual('J');
    expect(monthNumber).toEqual(6);
    expect(percentage).toEqual(2.1);
    expect(quantity).toEqual(23.4);
    expect(unit).toEqual('tCO2e');
  });

  test('method getGreenhouseGasEmissionByMonth should return correct model', () => {
    const model1 = new GreenhouseGasEmissionModel({ monthNumber: 2 });
    const model2 = new GreenhouseGasEmissionModel({ monthNumber: 5 });
    const model3 = new GreenhouseGasEmissionModel({ monthNumber: 7 });
    expect(
      GreenhouseGasEmissionModel.getGreenhouseGasEmissionByMonth(
        [model1, model2, model3],
        5,
      ),
    ).toEqual(model2);
  });

  test('method getQuantityDisplay should return US locale string up to 1 decimal', () => {
    const model = new GreenhouseGasEmissionModel({ quantity: 1234.554 });
    expect(model.getQuantityDisplay()).toEqual('1,234.6');
    const model2 = new GreenhouseGasEmissionModel({ quantity: 234.943 });
    expect(model2.getQuantityDisplay()).toEqual('234.9');
    const model3 = new GreenhouseGasEmissionModel({ quantity: 234.96 });
    expect(model3.getQuantityDisplay()).toEqual('235');
  });

  test('method getPercentageDisplay should return formatted string', () => {
    const model = new GreenhouseGasEmissionModel({ percentage: 0 });
    expect(model.getPercentageDisplay()).toEqual('+/- 0%');
    const model2 = new GreenhouseGasEmissionModel({ percentage: -1.5 });
    expect(model2.getPercentageDisplay()).toEqual('- 1.5%');
    const model3 = new GreenhouseGasEmissionModel({ percentage: 2.93 });
    expect(model3.getPercentageDisplay()).toEqual('+ 2.93%');
  });

  test('method getPercentageColor should return correct color', () => {
    const model = new GreenhouseGasEmissionModel({ percentage: 0 });
    expect(model.getPercentageColor()).toEqual(colors.blue);
    const model2 = new GreenhouseGasEmissionModel({ percentage: -1.5 });
    expect(model2.getPercentageColor()).toEqual(colors.green);
    const model3 = new GreenhouseGasEmissionModel({ percentage: 2.93 });
    expect(model3.getPercentageColor()).toEqual(colors.error);
  });
});
