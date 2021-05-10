import { BuildingEngineerAnalyticsChartModel } from './buildingEngineerAnalyticsChart';

describe('BuildingEngineerAnalyticsChartModel', () => {
  it('should initialize expected model from document', () => {
    const model = new BuildingEngineerAnalyticsChartModel(2019, 2020, {
      2019: {
        1: 11,
        2: 12,
        3: 13,
      },
      2020: {
        1: 1,
        2: 2,
        3: 3,
      },
    });
    expect(model.year1).toEqual(2019);
    expect(model.year2).toEqual(2020);
    expect(model.year1Comparison).toEqual([11, 12, 13]);
    expect(model.year2Comparison).toEqual([1, 2, 3]);
    expect(model.generateYear1SeriesBarOptions()).toEqual({
      borderColor: '#002361',
      color: '#002361',
      data: [11, 12, 13],
      id: 'year-1',
      name: '2019',
      type: 'column',
    });
    expect(model.generateYear2SeriesBarOptions()).toEqual({
      borderColor: '#B9CDEB',
      color: '#B9CDEB',
      data: [1, 2, 3],
      id: 'year-2',
      name: '2020',
      type: 'column',
    });
  });
});
