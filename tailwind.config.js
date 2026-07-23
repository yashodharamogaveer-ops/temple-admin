/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf3f2', 100: '#fbe4e1', 200: '#f5c9c3', 300: '#eba299',
          400: '#dd7266', 500: '#c94c3d', 600: '#a83626', // primary accent
          700: '#8c2c1f', 800: '#742a20', 900: '#5c2018', 950: '#320f0a',
        },
        saffron: {
          50: '#fffaeb', 100: '#fff0c2', 200: '#ffe08a', 300: '#ffc94d',
          400: '#ffb020', 500: '#f79509', 600: '#db7304', 700: '#b55507',
          800: '#93420d', 900: '#79390f',
        },
      },
      fontFamily: {
        display: ['"Noto Serif Kannada"', '"Noto Serif"', 'serif'],
        body: ['"Inter"', '"Noto Sans Kannada"', 'sans-serif'],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.25rem' },
    },
  },
  plugins: [],
}
