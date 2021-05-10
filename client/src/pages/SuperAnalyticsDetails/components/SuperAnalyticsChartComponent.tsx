import React, { useEffect, useState } from 'react';
import Highcharts, { Chart, Options } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { SuperAnalyticsChartModel } from 'models';
import { getChartOptions } from '../utils/getChartOptions';

interface Props {
  superAnalyticsChart: SuperAnalyticsChartModel | null;
}

export const SuperAnalyticsChartComponent: React.FC<Props> = ({ superAnalyticsChart }: Props) => {
  const [chartObj, setChart] = useState<Chart | undefined>();
  const [chartOptions, setChartOptions] = useState<Options>({
    lang: { thousandsSep: ',' },
    title: { text: undefined },
  });

  useEffect(() => {
    if (superAnalyticsChart) {
      chartObj?.hideLoading();
      setChartOptions(getChartOptions(superAnalyticsChart));
    } else {
      chartObj?.showLoading();
    }
  }, [superAnalyticsChart]);

  useEffect(() => {
    if (chartObj) {
      if (superAnalyticsChart) {
        chartObj.hideLoading();
      } else {
        chartObj.showLoading();
      }
    }
  }, [chartObj]);

  return (
    <div style={{'marginTop': '27px', 'position': 'relative'}}>
      <HighchartsReact
        options={chartOptions}
        highcharts={Highcharts}
        callback={(chart: Chart) => setChart(chart)}
      />
    </div>
  );
};
