import React from 'react';

interface Props {
  id: string;
  className?: string;
  width?: number;
  height?: number;
  data?: any[];
  /** TODO switching charts display or not */
  toolbar?:boolean;
  /** TODO mode */
  development?: boolean;
  title?: string;
  description?: string;
  purpose?: 'Comparison' | 'Trend' | 'Distribution' | 'Rank' | 'Proportion' | 'Composition';
};

export const AutoChart = (props: Props) => {
  return (
    <div id={props.id}>
      {props.title}
    </div>
  );
};