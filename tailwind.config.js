/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Legacy static HTML (kept during migration so old pages still get utilities)
    './*.html',
    // New Eleventy templates + partials + layouts
    './src/**/*.{njk,html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'vornac-black': '#020308',
        'vornac-gold': '#ffa317',
        'vornac-grey-dark': '#111317',
        'vornac-grey-top': '#1C1E23',
        'vornac-grey-light': '#C0C3C8',
        'vornac-red': '#FF4B4B',
        amber: {
          50:  '#fff7e9',
          100: '#ffecc7',
          200: '#ffd591',
          300: '#ffc35a',
          400: '#ffb33a',
          500: '#ffa317',
          600: '#d68500',
          700: '#a36800',
          800: '#7a4f00',
          900: '#523500',
        },
      },
      fontFamily: {
        display: ['"Saira Condensed"', '"Archivo"', 'system-ui', 'sans-serif'],
        heading: ['"Archivo"', 'system-ui', 'sans-serif'],
        body: ['"Archivo"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        content: '72rem', // 1152px
      },
      boxShadow: {
        soft: '0 18px 45px rgba(0,0,0,0.45)',
        'glow-gold': '0 0 40px rgba(255, 163, 38, 0.15)',
      },
      borderRadius: {
        lg2: '1rem',
      },
      animation: {
        'orbit-slow': 'orbit 25s linear infinite',
        'orbit-medium': 'orbit 20s linear infinite reverse',
        'orbit-fast': 'orbit 15s linear infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(80px) rotate(-360deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};