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
      colors: {
        dark: '#222222',
        light: '#f5f5f5',
        'light-gray': '#ebebeb',
        'medium-gray': '#595959',
        coral: '#F24236',
        purple: '#7161ef',
        'light-purple': '#D4D0FA',
        'hover-light-purple': '#A49EDB',
      },
    },
  },
  plugins: [],
};
export default config;
