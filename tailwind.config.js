export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0f172a',
        ink: '#e5eefb',
        muted: '#94a3b8',
        accent: '#7c3aed',
        cyan: '#22d3ee',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(148,163,184,0.08), 0 10px 30px rgba(2,6,23,0.45)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.14) 1px, transparent 0)',
      }
    },
  },
  plugins: [],
};
