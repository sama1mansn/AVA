import { createEntityPhraseFactory } from '../createEntityPhraseFactory';
import { getThemeColor } from '../../../theme';
import { isNumberLike } from '../../../../utils';

import type { SpecificEntityPhraseDescriptor } from '../plugin-protocol.type';

const defaultMetricValueDescriptor: SpecificEntityPhraseDescriptor = {
  encoding: {
    color: (value, metadata, { theme }) => getThemeColor('colorMetricValue', theme),
  },
  tooltip: {
    title: (value, metadata) => (isNumberLike(metadata.origin) ? `${metadata.origin}` : null),
  },
};

export const createMetricValue = createEntityPhraseFactory('metric_value', defaultMetricValueDescriptor);
