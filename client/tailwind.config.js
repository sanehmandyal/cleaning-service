export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { navy: { 900: '#0a1f44', 800: '#10305f', 700: '#173f7a' }, brand: { DEFAULT: '#1d6fe0', 600: '#1558b8', 100: '#e6f0fd', 50: '#f2f7fe' } },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
