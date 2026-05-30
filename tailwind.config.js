/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        void: '#070709',
        surface: '#0f0f14',
        panel: '#16161e',
        border: '#1e1e2a',
        accent: '#e63b6f',
        'accent-dim': '#8b1f3f',
        lime: '#a3f44e',
        'lime-dim': '#5a8a23',
        muted: '#5a5a72',
        subtle: '#3a3a4e',
        text: '#e8e8f0',
        'text-dim': '#9090a8',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'spin-slow': 'spin 4s linear infinite',
      },
      keyframes: {
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
