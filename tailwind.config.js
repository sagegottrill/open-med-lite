/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        clinical: {
          DEFAULT: '#0c4a6e',
          accent: '#0369a1',
          surface: '#f0f9ff',
          ink: '#0f172a',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
