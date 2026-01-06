/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './comcenter.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'vornac-black': '#020308',
        'vornac-gold': '#FFA326',
        'vornac-grey-dark': '#111317',
        'vornac-grey-top': '#1C1E23',
        'vornac-grey-light': '#C0C3C8',
        'vornac-red': '#FF4B4B',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
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