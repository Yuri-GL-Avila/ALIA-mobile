export const colors = {
  // Primary blacks
  black: '#050505',
  blackSecondary: '#101010',
  blackTertiary: '#1A1A1A',
  
  // Pinks
  pink: '#7A0034',
  pinkLight: '#A51D58',
  pinkDark: '#5C0027',
  
  // Neutrals
  white: '#FFFFFF',
  gray: '#A5A5A5',
  grayDark: '#6B6B6B',
  grayLight: '#E0E0E0',
  
  // Status
  success: '#2ECC71',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#3498DB',
  
  // Transparent
  black80: 'rgba(5, 5, 5, 0.8)',
  black60: 'rgba(5, 5, 5, 0.6)',
  pink20: 'rgba(122, 0, 52, 0.2)',
  pink40: 'rgba(122, 0, 52, 0.4)',
};

export type ColorKey = keyof typeof colors;
