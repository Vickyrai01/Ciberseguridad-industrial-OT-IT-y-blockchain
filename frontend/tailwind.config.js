/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './**/*.{js,ts,jsx,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        'ot-bg': 'var(--bg)',
        'ot-panel': 'var(--panel)',
        'ot-line': 'var(--line)',
        'ot-muted': 'var(--muted)',
        'ot-green': 'var(--green)',
        'ot-cyan': 'var(--cyan)',
        'ot-yellow': 'var(--yellow)',
        'ot-red': 'var(--red)',
        'ot-orange': 'var(--orange)',
        'ot-zone': '#7a9ba0',
        'ot-zone-muted': '#506e75',
      },
      fontFamily: {
        display: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}
