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
        'bin-primary': '#fcd535',
        'bin-primary-active': '#f0b90b',
        'bin-primary-disabled': '#3a3a1f',
        'bin-canvas': '#0b0e11',
        'bin-canvas-light': '#ffffff',
        'bin-surface': '#1e2329',
        'bin-elevated': '#2b3139',
        'bin-ondark': '#ffffff',
        'bin-body': '#eaecef',
        'bin-muted': '#707a8a',
        'bin-muted-strong': '#929aa5',
        'bin-hairline': '#2b3139',
        'bin-hairline-light': '#eaecef',
        'bin-up': '#0ecb81',
        'bin-down': '#f6465d',
        'bin-info': '#3b82f6',
        'bin-ink': '#181a20',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
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
