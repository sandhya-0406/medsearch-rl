/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        workspace: {
          bg: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          surface: 'var(--bg-surface)',
          border: 'var(--border-color)',
          text: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        ai: {
          cyan: '#06B6D4',
          purple: '#8B5CF6',
          blue: '#3B82F6',
          darkBg: '#0B1120',
          darkCard: '#111827',
        },
        clinical: {
          blue: '#2563EB',
          sky: '#0EA5E9',
          lightBg: '#F8FAFC',
          lightCard: '#FFFFFF',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};