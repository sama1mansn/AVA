import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { List } from 'antd';
import { specToG2Plot } from '@antv/antv-spec';

// import
import { Linter } from '@antv/chart-advisor';

const Chart = ({ id, spec }) => {
  useEffect(() => {
    specToG2Plot(spec, document.getElementById(id));
  });

  return <div id={id} style={{ width: '100%', height: 200, margin: 'auto' }}></div>;
};

const LintCard = ({ lints }) => {
  return (
    <List
      key={`lint-${+new Date()}`}
      itemLayout="vertical"
      pagination={{ pageSize: 1 }}
      dataSource={lints}
      split={false}
      renderItem={(item, index) => {
        return (
          <List.Item key={index}>
            <strong style={{ fontSize: 18 }}>Error ID: {item.id}</strong>
            <div>Error Type: {item.type}</div>
            <div>Score: {item.score}</div>
            <div>docs: {item.docs.lintText}</div>
          </List.Item>
        );
      }}
    ></List>
  );
};

// contants

const errorSpec = {
  basis: {
    type: 'chart',
  },
  data: {
    type: 'json-array',
    values: [
      { category: 'A', value: 4 },
      { category: 'B', value: 6 },
      { category: 'C', value: 10 },
      { category: 'D', value: 3 },
      { category: 'E', value: 7 },
      { category: 'F', value: 8 },
    ],
  },
  layer: [
    {
      mark: 'arc',
      encoding: {
        theta: { field: 'value', type: 'quantitative' },
        color: {
          field: 'category',
          type: 'nominal',
          scale: { range: ['#5b8ff9', '#753d91', '#b03c63', '#d5b471', '#4fb01f', '#608b7d'] },
        },
      },
    },
  ],
};

// usage
const myLinter = new Linter();
const problems = myLinter.lint({ spec: errorSpec });

const App = () => {
  return (
    <>
      <LintCard lints={problems} />
      <Chart id={'linter-demo'} spec={errorSpec} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('container'));