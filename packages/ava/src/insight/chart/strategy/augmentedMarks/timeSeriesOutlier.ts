import { AreaMark, LineMark, Mark, PointMark } from '@antv/g2';

import { TimeSeriesOutlierInfo, InsightInfo } from '../../../types';
import { AreaMarkData, LineMarkData, TimeSeriesOutlierMark } from '../../types';
import { insight2ChartStrategy } from '../chart';
import { areaMarkStrategy, lineMarkStrategy, pointMarkStrategy } from '../commonMarks';

const BASELINE = 'baseline';
const INTERVAL = 'interval';
const OUTLIER = 'outlier';

export const timeSeriesOutlierStrategyAugmentedMarksStrategy = (
  insight: InsightInfo<TimeSeriesOutlierInfo>
): TimeSeriesOutlierMark[] => {
  const {
    data: chartData,
    dimensions: [{ fieldName: dimensionName }],
    patterns,
  } = insight;
  const { baselines, thresholds } = patterns[0];
  const data = chartData.map((datum, index) => {
    const baseline = baselines[index];
    const interval = [baseline - Math.abs(thresholds[0]), baseline + thresholds[1]];
    return {
      baseline: {
        x: datum[dimensionName],
        y: baseline,
      },
      interval: {
        x: datum[dimensionName],
        y: interval,
      },
    };
  });

  const intervalData = data.map((datum) => datum[INTERVAL]) as AreaMarkData;
  const intervalMark = areaMarkStrategy(intervalData, {
    encode: {
      shape: 'smooth',
    },
    style: {
      fillOpacity: 0.3,
      fill: '#ffd8b8',
    },
    tooltip: {
      title: '',
      items: [
        (_d, i, _data, column) => ({
          name: INTERVAL,
          value: `${column.y.value[i as number]}-${column.y1.value[i as number]}`,
          color: '#ffd8b8',
        }),
      ],
    },
  });

  const baselineData = data.map((datum) => datum[BASELINE]) as LineMarkData['points'];
  const baselineMark = lineMarkStrategy(
    { points: baselineData },
    {
      encode: {
        shape: 'smooth',
      },
      style: {
        lineWidth: 1,
        stroke: '#ffa45c',
        lineDash: undefined,
      },
      tooltip: {
        title: '',
        items: [{ name: BASELINE, channel: 'y' }],
      },
    }
  );

  const outlierMark = pointMarkStrategy(patterns, {
    style: {
      fill: '#f4664a',
      stroke: '#f4664a',
    },
    tooltip: {
      title: '',
      items: [{ name: OUTLIER, channel: 'y' }],
    },
  });

  return [
    {
      trendLine: [baselineMark as LineMark],
      anomalyArea: [intervalMark as AreaMark],
      outliers: [outlierMark as PointMark],
    },
  ];
};

export const timeSeriesOutlierStrategy = (insight: InsightInfo<TimeSeriesOutlierInfo>): Mark[] => {
  // Should to support marks free combination
  const chartMark = insight2ChartStrategy(insight);
  const {
    trendLine = [],
    anomalyArea = [],
    outliers = [],
  } = timeSeriesOutlierStrategyAugmentedMarksStrategy(insight)[0] || {};
  return [...anomalyArea, ...trendLine, chartMark, ...outliers];
};
