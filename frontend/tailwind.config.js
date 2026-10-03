/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Teal (Strictly no gradients with teal)
        primary: {
          DEFAULT: '#0F766E',
          hover: '#115E59',
          active: '#134E4A',
          light: '#CCFBF1',
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0F766E',
          700: '#115E59',
          800: '#134E4A',
          900: '#134E4A',
        },
        // Neutral palette
        neutral: {
          main: '#F8FAFC',
          card: '#FFFFFF',
          dark: '#18181B',
          darkSecondary: '#27272A',
          darkBorder: '#3F3F46',
          textPrimary: '#1E293B',
          textSecondary: '#64748B',
          textMuted: '#94A3B8',
          border: '#E2E8F0',
        },
        // Dark IDE / Code Editor
        editor: {
          bg: '#18181B',
          secondary: '#27272A',
          text: '#E4E4E7',
          lineNumbers: '#71717A',
          border: '#3F3F46',
          currentLine: '#27272A',
          selection: '#3F3F46',
          errorLine: '#450A0A',
          warningLine: '#451A03',
        },
        // Semantic Error
        err: {
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
          bg: '#FEF2F2',
          border: '#FECACA',
        },
        // Semantic Warning
        warn: {
          DEFAULT: '#D97706',
          dark: '#B45309',
          bg: '#FFFBEB',
          border: '#FDE68A',
        },
        // Semantic Success
        succ: {
          DEFAULT: '#15803D',
          dark: '#166534',
          bg: '#F0FDF4',
          border: '#BBF7D0',
        },
        // Backward-compatibility aliases for existing components
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0F766E',
          700: '#115E59',
          800: '#134E4A',
          900: '#134E4A',
        },
        surface: {
          950: '#18181B',
          900: '#18181B',
          850: '#202023',
          800: '#27272A',
          750: '#323236',
          700: '#3F3F46',
          600: '#52525B',
          500: '#71717A',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.08)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      }
    },
  },
  plugins: [],
}
