/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "'Space Grotesk'", "sans-serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        saathi: {
          50:  '#eef5ff',
          100: '#d9e9ff',
          200: '#bcd6ff',
          300: '#8ebbff',
          400: '#5994ff',
          500: '#3b72fb',
          600: '#1f4ef0',
          700: '#173bdd',
          800: '#1931b3',
          900: '#1a2f8d',
          950: '#141d55',
        },
        ink: {
          DEFAULT: '#0b0f1a',
          50: '#f4f5f9',
          100: '#e8eaf2',
          200: '#cdd1e5',
          300: '#a3acce',
          400: '#7280b2',
          500: '#526199',
          600: '#3d4b7f',
          700: '#323d67',
          800: '#2b3457',
          900: '#272e4a',
          950: '#0b0f1a',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'score-fill': 'scoreFill 1.5s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'recording-ring': 'recordingRing 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        recordingRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.15)', opacity: '0.6' },
        }
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 60% 0%, #3b72fb22 0%, transparent 70%), radial-gradient(ellipse at 10% 80%, #5994ff11 0%, transparent 60%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
