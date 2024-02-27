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
    extend: {},
  },
  plugins: [],
};
export default config;
