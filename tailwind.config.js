/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#e8faf6',
          100: '#c3f0e5',
          200: '#86e2cc',
          300: '#4dd3b3',
          400: '#1ABC9C',
          500: '#17a589',
          600: '#148f76',
          700: '#107a63',
          800: '#0d6450',
          900: '#0a4f3e',
        },
        navy: {
          50: '#eef1f5',
          100: '#d4dce7',
          200: '#a9b9cf',
          300: '#7e96b7',
          400: '#53739f',
          500: '#2C3E50',
          600: '#253547',
          700: '#1e2c3e',
          800: '#172335',
          900: '#101a2c',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
