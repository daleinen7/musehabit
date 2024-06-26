import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      satoshi: ['var(--font-satoshi)'],
      satoshiItalic: ['var(--font-satoshi-italic)'],
      hepta: ['var(--font-hepta)'],
    },
    extend: {
      boxShadow: {
        'input-shadow':
          '0 1px 3px 0 rgb(120 30 30 / 0.9), 0 1px 2px -1px rgb(0 0 0 / 0.9)',
      },

      colors: {
        dark: '#222222',
        light: '#f5f5f5',
        'light-gray': '#ebebeb',
        'light-gray-h': '#f5f5f5',
        'medium-gray': '#595959',
        'medium-gray-h': '#8c8c8c',
        'dark-gray': '#333333',
        'dark-gray-h': '#4f4f4f',
        'input-gray': '#6C6C6C',
        coral: '#F24236',
        'colral-h': '#F5585B',
        purple: '#6200B3',
        lavender: '#7161ef',
        'light-purple': '#D4D0FA',
        'hover-light-purple': '#A49EDB',
      },
    },
  },
  plugins: [],
};
export default config;
