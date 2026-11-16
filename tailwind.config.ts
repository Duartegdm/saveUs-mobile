import type { Config } from 'tailwindcss';

import { colors } from './src/theme/colors';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      borderRadius: {
        DEFAULT: '4px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },
      spacing: {
        'space-xs': '4px',
        'space-sm': '8px',
        'space-md': '16px',
        'space-lg': '24px',
        'space-xl': '32px',
        'space-2xl': '48px',
        gutter: '24px',
        'gutter-mobile': '16px',
        margin: '32px',
        'margin-mobile': '16px',
      },
      fontFamily: {
        jakarta: ['PlusJakartaSans_400Regular'],
        'jakarta-medium': ['PlusJakartaSans_500Medium'],
        'jakarta-semibold': ['PlusJakartaSans_600SemiBold'],
        'jakarta-bold': ['PlusJakartaSans_700Bold'],
        'jakarta-extrabold': ['PlusJakartaSans_800ExtraBold'],
      },
      fontSize: {
        'label-sm': ['13px', { lineHeight: '18px', letterSpacing: '0.5px' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.3px' }],
        'body-sm': ['15px', { lineHeight: '22px' }],
        'body-md': ['16px', { lineHeight: '24px' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'headline-sm': ['20px', { lineHeight: '28px' }],
        'headline-lg': ['24px', { lineHeight: '32px', letterSpacing: '-0.12px' }],
        'headline-xl': ['32px', { lineHeight: '40px', letterSpacing: '-0.32px' }],
        'display-lg-mobile': ['36px', { lineHeight: '44px', letterSpacing: '-0.54px' }],
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.96px' }],
        'numeric-metric-mobile': ['40px', { lineHeight: '44px', letterSpacing: '-0.8px' }],
        'numeric-metric': ['56px', { lineHeight: '60px', letterSpacing: '-1.68px' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
