/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9dffd',
          300: '#7cc5fb',
          400: '#36a7f6',
          500: '#0c8ce9',
          600: '#006fc7',
          700: '#0158a1',
          800: '#064b85',
          900: '#0b3f6e',
          950: '#072849',
        },
        signal: {
          green: '#16a34a',
          yellow: '#ca8a04',
          red: '#dc2626',
        },
        viability: {
          positive: '#dcfce7',
          warning: '#fef9c3',
          negative: '#fee2e2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
