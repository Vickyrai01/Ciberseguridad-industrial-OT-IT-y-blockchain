/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        'ot-bg': '#061017',
        'ot-panel': '#0c1b23',
        'ot-line': '#24404a',
        'ot-muted': '#76909a',
        'ot-green': '#67e0b0',
        'ot-cyan': '#6dd9e5',
        'ot-yellow': '#e4b354',
        'ot-red': '#f36c61',
        'ot-orange': '#f49a6c',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
