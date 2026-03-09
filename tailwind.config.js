export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#F5F0E8',
          secondary: '#EDE7DB',
          card: '#FFFDF8',
          'card-hover': '#FFF9EF',
          warm: '#F0E6D4',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E2C97E',
          dark: '#A68A3E',
        },
        silver: {
          DEFAULT: '#A8A8A8',
          light: '#C5C5C5',
        },
        text: {
          primary: '#2C2418',
          secondary: '#7A6F5F',
          muted: '#A69D8E',
        },
        confidence: {
          high: '#4CAF50',
          medium: '#E6A817',
          low: '#D44638',
        },
        border: '#DDD5C4',
        accent: {
          DEFAULT: '#8B6914',
          light: '#C9A84C',
        },
      },
    },
  },
  plugins: [],
}
