/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      colors: {
        'primary': {
          DEFAULT: '#fcd535',
          active: '#f0b90b',
          disabled: '#3a3a1f',
        },
        'canvas-dark': '#0b0e11',
        'canvas-light': '#ffffff',
        'surface-card-dark': '#1e2329',
        'surface-elevated-dark': '#2b3139',
        'surface-soft-light': '#fafafa',
        'surface-strong-light': '#f5f5f5',
        'on-dark': '#ffffff',
        'on-primary': '#181a20',
        'ink': '#181a20',
        'body-on-dark': '#eaecef',
        'body-on-light': '#181a20',
        'muted': {
          DEFAULT: '#707a8a',
          strong: '#929aa5',
        },
        'hairline-on-dark': '#2b3139',
        'hairline-on-light': '#eaecef',
        'border-strong': '#cdd1d6',
        'accent-turquoise': '#2dbdb6',
        'info': {
          DEFAULT: '#3b82f6',
          ring: '#3b82f6',
        },
        'trading-up': '#0ecb81',
        'trading-down': '#f6465d',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-sm': ['32px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '0' }],
        'display-md': ['40px', { lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.3px' }],
        'display-lg': ['48px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.5px' }],
        'title-lg': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'title-md': ['20px', { lineHeight: '1.35', fontWeight: '600' }],
        'title-sm': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-md': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        'button': ['14px', { lineHeight: '1', fontWeight: '600' }],
        'number-display': ['40px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.3px' }],
        'number-md': ['16px', { lineHeight: '1.4', fontWeight: '500' }],
        'number-sm': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
