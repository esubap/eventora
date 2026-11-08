/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ecff',
          200: '#c7dcff',
          300: '#9ec4ff',
          400: '#6ca2ff',
          500: '#437df8',
          600: '#2b5ff0',
          700: '#2149dc',
          800: '#1e3cb2',
          900: '#1e378c',
          950: '#162356',
        },
        squad: {
          neon: '#06ffa5',
          purple: '#9d4edd',
          pink: '#ff007f',
          orange: '#ff7700',
          cyan: '#00f0ff',
          yellow: '#ffe600',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Cabinet Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(157, 78, 221, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(6, 255, 165, 0.7))' },
        },
        gradientX: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        }
      }
    },
  },
  plugins: [],
}
