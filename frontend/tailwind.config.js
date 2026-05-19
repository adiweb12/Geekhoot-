/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-syne)', 'sans-serif'],
        mono:    ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#fff4ef',
          100: '#ffe9df',
          200: '#ffc9b0',
          300: '#ffaa80',
          400: '#ff7c40',
          500: '#ff5200',  // Primary brand color
          600: '#e04700',
          700: '#b83a00',
          800: '#8f2e00',
          900: '#6b2200',
        },
      },
      animation: {
        'slide-in':  'slideIn 0.3s ease-out',
        'fade-up':   'fadeUp 0.38s ease-out',
        shimmer:     'shimmer 1.5s infinite',
        'bounce-sm': 'bounceSm 1s infinite',
      },
      keyframes: {
        slideIn: {
          '0%':   { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',      opacity: '1' },
        },
        fadeUp: {
          '0%':   { transform: 'translateY(18px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'translateY(-4px)' },
          '50%':      { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
