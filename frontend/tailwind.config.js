/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // Crisp Emerald / Lime Green
          dark: '#059669',
          light: '#34d399',
        },
        dark: {
          950: '#09090b',
          900: '#18181b',
          850: '#27272a',
          800: '#3f3f46',
          700: '#52525b',
        },
        ink: {
          950: '#09090b', // Deep Crisp Black for high visibility
          900: '#18181b', // Crisp Black/Charcoal for body text
          850: '#27272a',
          800: '#3f3f46',
          750: '#52525b',
          700: '#71717a',
          600: '#a1a1aa',
        },
        ivory: {
          light: '#FFFFFF',
          DEFAULT: '#FFFFFF',
          dark: '#f4f4f5',
          muted: '#71717a',
          glass: 'rgba(255, 255, 255, 0.85)',
          'glass-border': 'rgba(16, 185, 129, 0.25)',
          'glass-hover': 'rgba(240, 253, 244, 0.9)',
        },
        teal: {
          electric: '#059669', // Rich visible emerald green
          hover: '#047857',
          dark: '#065f46',
          light: '#10b981',
          faint: 'rgba(16, 185, 129, 0.12)',
          glass: 'rgba(16, 185, 129, 0.15)',
        },
        // The 5 Brand Palette Colors from uploaded specs
        brand: {
          crimson: '#A60E35', // 01 Crimson Red
          sunset: '#FEA24F',  // 02 Sunset Orange
          aqua: '#10BBC3',    // 03 Aqua Blue
          teal: '#068187',    // 04 Teal Green
          navy: '#051A2D',    // 05 Deep Navy
        },
        crimson: {
          DEFAULT: '#A60E35',
          light: '#C7184A',
          dark: '#800A28',
          glow: 'rgba(166, 14, 53, 0.35)',
        },
        sunset: {
          DEFAULT: '#FEA24F',
          light: '#FFB874',
          dark: '#E67E22',
          glow: 'rgba(254, 162, 79, 0.35)',
        },
        aqua: {
          DEFAULT: '#10BBC3',
          light: '#33D0D8',
          dark: '#0A949B',
          glow: 'rgba(16, 187, 195, 0.35)',
        },
        pine: {
          DEFAULT: '#068187',
          light: '#09A7AF',
          dark: '#045F64',
          glow: 'rgba(6, 129, 135, 0.35)',
        },
        navy: {
          DEFAULT: '#051A2D',
          light: '#0B3356',
          dark: '#020C17',
          glow: 'rgba(5, 26, 45, 0.45)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 253, 244, 0.9) 100%)',
        'glass-gradient-hover': 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(236, 253, 245, 0.95) 100%)',
        'lime-btn': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'ivory-teal-btn': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'teal-ivory-btn': 'linear-gradient(135deg, #10b981 0%, #34d399 60%, #ffffff 100%)',
        'text-gradient': 'linear-gradient(135deg, #09090b 0%, #065f46 100%)',
      },
      boxShadow: {
        'glow-teal': '0 0 25px -4px rgba(16, 185, 129, 0.35)',
        'glow-lime': '0 0 30px -4px rgba(16, 185, 129, 0.40)',
        'glass-card': '0 10px 25px -5px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1)',
        'ink-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        'ink-raised': '0 8px 24px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
