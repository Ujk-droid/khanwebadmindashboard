import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(16, 24, 37, 0.68)',
        tealGlow: '#2dd4bf',
        blueGlow: '#38bdf8'
      },
      boxShadow: {
        glow: '0 25px 80px rgba(45, 212, 191, 0.18)',
        softGlow: '0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        'teal-blue-gradient': 'linear-gradient(135deg, rgba(45,212,191,0.92), rgba(56,189,248,0.84))',
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
};

export default config;
