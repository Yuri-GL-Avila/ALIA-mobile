export * from './colors';
export * from './typography';
export * from './spacing';

import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
};

export default theme;
