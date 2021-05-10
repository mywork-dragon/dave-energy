import { EnergyStarRatingModel } from './energyStarRating';
import { colors } from 'design-system';

describe('EnergyStarRatingModel', () => {
  it('should initialize with data', () => {
    const model = new EnergyStarRatingModel({
      change: -2,
      month: 1,
      monthDisplay: 'Jan',
      value: 3,
    });
    expect(model).toBeInstanceOf(EnergyStarRatingModel);
    const { change, month, monthDisplay, value } = model;
    expect({ change, month, monthDisplay, value }).toEqual({
      change: -2,
      month: 1,
      monthDisplay: 'Jan',
      value: 3,
    });
  });

  test('method getEnergyStarRatingByMonth should return correct model', () => {
    const model1 = new EnergyStarRatingModel({ month: 1 });
    const model2 = new EnergyStarRatingModel({ month: 4 });
    const model3 = new EnergyStarRatingModel({ month: 9 });
    expect(
      EnergyStarRatingModel.getEnergyStarRatingByMonth(
        [model1, model2, model3],
        4,
      ),
    ).toEqual(model2);
  });

  test('method getValueColor should return correct color', () => {
    const model1 = new EnergyStarRatingModel({});
    expect(model1.getValueColor()).toEqual(colors.blue);
    const model2 = new EnergyStarRatingModel({ value: 100 });
    expect(model2.getValueColor()).toEqual(colors.green);
    const model3 = new EnergyStarRatingModel({ value: 75 });
    expect(model3.getValueColor()).toEqual(colors.green);
    const model4 = new EnergyStarRatingModel({ value: 74 });
    expect(model4.getValueColor()).toEqual(colors.yellow);
    const model5 = new EnergyStarRatingModel({ value: 26 });
    expect(model5.getValueColor()).toEqual(colors.yellow);
    const model6 = new EnergyStarRatingModel({ value: 25 });
    expect(model6.getValueColor()).toEqual(colors.error);
    const model9 = new EnergyStarRatingModel({ value: 0 });
    expect(model9.getValueColor()).toEqual(colors.error);
  });
});

test('method getChangeDisplay should display formatted string', () => {
  const model1 = new EnergyStarRatingModel({ change: 0 });
  expect(model1.getChangeDisplay()).toEqual('+/- 0 pts');
  const model2 = new EnergyStarRatingModel({ change: -1.2 });
  expect(model2.getChangeDisplay()).toEqual('- 1.2 pts');
  const model3 = new EnergyStarRatingModel({ change: 3.45 });
  expect(model3.getChangeDisplay()).toEqual('+ 3.45 pts');
});

test('method getChangeColor should return correct color', () => {
  const model1 = new EnergyStarRatingModel({ change: 0 });
  expect(model1.getChangeColor()).toEqual(colors.blue);
  const model2 = new EnergyStarRatingModel({ change: -1.2 });
  expect(model2.getChangeColor()).toEqual(colors.error);
  const model3 = new EnergyStarRatingModel({ change: 3.45 });
  expect(model3.getChangeColor()).toEqual(colors.green);
});
