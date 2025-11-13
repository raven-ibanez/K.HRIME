/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        khrime: {
          black: '#000000',
          dark: '#0A0A0A',
          charcoal: '#1A1A1A',
          gray: {
            50: '#F9F9F9',
            100: '#F0F0F0',
            200: '#E0E0E0',
            300: '#C0C0C0',
            400: '#9E9E9E',
            500: '#808080',
            600: '#606060',
            700: '#404040',
            800: '#2A2A2A',
            900: '#1A1A1A'
          },
          white: '#FFFFFF',
          accent: '#FFFFFF'
        }
      },
      fontFamily: {
        'gothic': ['Cinzel', 'serif'],
        'gothic-decorative': ['Cinzel Decorative', 'serif'],
        'display': ['Playfair Display', 'serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
};