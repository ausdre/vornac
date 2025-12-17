// 
module.exports = {
  content: ['./index.html', 'comcenter.html', './src/**/*.{js,ts,jsx,tsx}'],
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
      },
      borderRadius: {
        lg2: '1rem',
      },
    },
  },
  plugins: [],
};
