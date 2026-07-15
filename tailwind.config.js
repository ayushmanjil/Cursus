/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: {
          DEFAULT: '#FAF7F1',
          soft: '#F3EEE3',
        },
        ink: {
          DEFAULT: '#211C17',
          muted: '#6B6459',
          faint: '#9C9384',
        },
        brass: {
          50: '#FBF3E4',
          100: '#F3E1BC',
          300: '#DDB479',
          400: '#C89A54',
          500: '#B8863F',
          600: '#976B30',
          700: '#775327',
        },
        forest: {
          50: '#EAF0EB',
          100: '#CBDBCE',
          300: '#8FAE93',
          400: '#638568',
          500: '#4B6B58',
          600: '#3B5546',
          700: '#2E4237',
        },
        burgundy: {
          50: '#F6E9EA',
          100: '#E5C1C4',
          300: '#C17178',
          400: '#A24B52',
          500: '#8B3A42',
          600: '#6F2E35',
        },
        purple: {
          50: '#F0EBF5',
          100: '#D6C9E6',
          300: '#9E7EC0',
          400: '#7C5CA7',
          500: '#6B4C96',
          600: '#553C78',
          700: '#422E5E',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1E1A15',
        },
        bgdark: {
          DEFAULT: '#15120E',
          soft: '#1C1712',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(33, 28, 23, 0.06), 0 4px 12px rgba(33, 28, 23, 0.05)',
        cardHover: '0 2px 6px rgba(33, 28, 23, 0.08), 0 12px 28px rgba(33, 28, 23, 0.10)',
        modal: '0 20px 60px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
