import { join } from 'node:path'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      screens: {
        // needs to be this way to not to break tailwind intellisense
        ...require(join(__dirname, 'src/config/tailwind')).screensOverrides,
      },
      opacity: {
        inactive: '0.3',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'display-1-desktop': [
          '7.25rem',
          { lineHeight: '7.25rem', letterSpacing: 'calc(-2 * 0.01em)', fontWeight: 400 },
        ], // 116/116
        'display-2-desktop': ['4.5rem', { lineHeight: '4.5rem', letterSpacing: 'calc(-2 * 0.01em)', fontWeight: 400 }], // 72/72
        'display-3-desktop': ['3.5rem', { lineHeight: '3.5rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 400 }], // 56/56
        'heading-1-desktop': ['3rem', { lineHeight: '3.75rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 500 }], // 48/60
        'heading-2-desktop': ['2.625rem', { lineHeight: '3rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 500 }], // 42/48
        'heading-3-desktop': ['2rem', { lineHeight: '2.5rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 500 }], // 32/40
        'heading-4-desktop': ['1.5rem', { lineHeight: '1.75rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 500 }], // 24/28
        'heading-5-desktop': ['1.25rem', { lineHeight: '1.5rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 500 }], // 20/24
        'body-1-desktop': ['1.5rem', { lineHeight: '2.25rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 400 }], // 24/36
        'body-2-desktop': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 400 }], // 20/30
        'body-3-desktop': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 400 }], // 18/28
        'body-4-desktop': ['1rem', { lineHeight: '1.5rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 400 }], // 16/24
        'body-5-desktop': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 400 }], // 14/20
        'body-6-desktop': ['0.75rem', { lineHeight: '1.125rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 400 }], // 12/18
        'label-1-desktop': ['1.5rem', { lineHeight: '1.75rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 500 }], // 24/28
        'label-2-desktop': ['1.25rem', { lineHeight: '1.5rem', letterSpacing: 'calc(-1 * 0.01em)', fontWeight: 500 }], // 20/24
        'label-3-desktop': [
          '1.125rem',
          { lineHeight: '1.375rem', letterSpacing: 'calc(-0.5 * 0.01em)', fontWeight: 500 },
        ], // 18/22
        'label-4-desktop': ['1rem', { lineHeight: '1.125rem', letterSpacing: 'calc(-0.5 * 0.01em)', fontWeight: 500 }], // 16/18
        'label-5-desktop': ['0.875rem', { lineHeight: '1rem', letterSpacing: '0px', fontWeight: 500 }], // 14/16
        'label-6-desktop': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0px', fontWeight: 500 }], // 12/16
        'button-1-desktop': ['1rem', { lineHeight: '1.25rem', letterSpacing: '0px', fontWeight: 500 }], // 16/20
        'button-2-desktop': ['0.875rem', { lineHeight: '1rem', letterSpacing: '0px', fontWeight: 500 }], // 14/16
      },
      colors: {
        reskin: {
          base: {
            white: 'rgba(var(--base-white) / <alpha-value>)',
            black: 'rgba(var(--base-black) / <alpha-value>)',
          },
          neutral: {
            50: 'rgba(var(--neutral-50) / <alpha-value>)',
            100: 'rgba(var(--neutral-100) / <alpha-value>)',
            200: 'rgba(var(--neutral-200) / <alpha-value>)',
            300: 'rgba(var(--neutral-300) / <alpha-value>)',
            400: 'rgba(var(--neutral-400) / <alpha-value>)',
            500: 'rgba(var(--neutral-500) / <alpha-value>)',
            600: 'rgba(var(--neutral-600) / <alpha-value>)',
            700: 'rgba(var(--neutral-700) / <alpha-value>)',
            800: 'rgba(var(--neutral-800) / <alpha-value>)',
            900: 'rgba(var(--neutral-900) / <alpha-value>)',
            950: 'rgba(var(--neutral-950) / <alpha-value>)',
          },
          primary: {
            50: 'rgba(var(--primary-50) / <alpha-value>)',
            100: 'rgba(var(--primary-100) / <alpha-value>)',
            200: 'rgba(var(--primary-200) / <alpha-value>)',
            300: 'rgba(var(--primary-300) / <alpha-value>)',
            400: 'rgba(var(--primary-400) / <alpha-value>)',
            500: 'rgba(var(--primary-500) / <alpha-value>)',
            600: 'rgba(var(--primary-600) / <alpha-value>)',
            700: 'rgba(var(--primary-700) / <alpha-value>)',
            800: 'rgba(var(--primary-800) / <alpha-value>)',
            900: 'rgba(var(--primary-900) / <alpha-value>)',
            950: 'rgba(var(--primary-950) / <alpha-value>)',
          },
          success: {
            50: 'rgba(var(--success-50) / <alpha-value>)',
            100: 'rgba(var(--success-100) / <alpha-value>)',
            200: 'rgba(var(--success-200) / <alpha-value>)',
            300: 'rgba(var(--success-300) / <alpha-value>)',
            400: 'rgba(var(--success-400) / <alpha-value>)',
            500: 'rgba(var(--success-500) / <alpha-value>)',
            600: 'rgba(var(--success-600) / <alpha-value>)',
            700: 'rgba(var(--success-700) / <alpha-value>)',
            800: 'rgba(var(--success-800) / <alpha-value>)',
            900: 'rgba(var(--success-900) / <alpha-value>)',
            950: 'rgba(var(--success-950) / <alpha-value>)',
          },
          warning: {
            50: 'rgba(var(--warning-50) / <alpha-value>)',
            100: 'rgba(var(--warning-100) / <alpha-value>)',
            200: 'rgba(var(--warning-200) / <alpha-value>)',
            300: 'rgba(var(--warning-300) / <alpha-value>)',
            400: 'rgba(var(--warning-400) / <alpha-value>)',
            500: 'rgba(var(--warning-500) / <alpha-value>)',
            600: 'rgba(var(--warning-600) / <alpha-value>)',
            700: 'rgba(var(--warning-700) / <alpha-value>)',
            800: 'rgba(var(--warning-800) / <alpha-value>)',
            900: 'rgba(var(--warning-900) / <alpha-value>)',
            950: 'rgba(var(--warning-950) / <alpha-value>)',
          },
          error: {
            50: 'rgba(var(--error-50) / <alpha-value>)',
            100: 'rgba(var(--error-100) / <alpha-value>)',
            200: 'rgba(var(--error-200) / <alpha-value>)',
            300: 'rgba(var(--error-300) / <alpha-value>)',
            400: 'rgba(var(--error-400) / <alpha-value>)',
            500: 'rgba(var(--error-500) / <alpha-value>)',
            600: 'rgba(var(--error-600) / <alpha-value>)',
            700: 'rgba(var(--error-700) / <alpha-value>)',
            800: 'rgba(var(--error-800) / <alpha-value>)',
            900: 'rgba(var(--error-900) / <alpha-value>)',
            950: 'rgba(var(--error-950) / <alpha-value>)',
          },
          green: {
            50: 'rgba(var(--green-50) / <alpha-value>)',
            100: 'rgba(var(--green-100) / <alpha-value>)',
            200: 'rgba(var(--green-200) / <alpha-value>)',
            300: 'rgba(var(--green-300) / <alpha-value>)',
            400: 'rgba(var(--green-400) / <alpha-value>)',
            500: 'rgba(var(--green-500) / <alpha-value>)',
            600: 'rgba(var(--green-600) / <alpha-value>)',
            700: 'rgba(var(--green-700) / <alpha-value>)',
            800: 'rgba(var(--green-800) / <alpha-value>)',
            900: 'rgba(var(--green-900) / <alpha-value>)',
            950: 'rgba(var(--green-950) / <alpha-value>)',
          },
          orange: {
            50: 'rgba(var(--orange-50) / <alpha-value>)',
            100: 'rgba(var(--orange-100) / <alpha-value>)',
            200: 'rgba(var(--orange-200) / <alpha-value>)',
            300: 'rgba(var(--orange-300) / <alpha-value>)',
            400: 'rgba(var(--orange-400) / <alpha-value>)',
            500: 'rgba(var(--orange-500) / <alpha-value>)',
            600: 'rgba(var(--orange-600) / <alpha-value>)',
            700: 'rgba(var(--orange-700) / <alpha-value>)',
            800: 'rgba(var(--orange-800) / <alpha-value>)',
            900: 'rgba(var(--orange-900) / <alpha-value>)',
            950: 'rgba(var(--orange-950) / <alpha-value>)',
          },
          magenta: {
            50: 'rgba(var(--magenta-50) / <alpha-value>)',
            100: 'rgba(var(--magenta-100) / <alpha-value>)',
            200: 'rgba(var(--magenta-200) / <alpha-value>)',
            300: 'rgba(var(--magenta-300) / <alpha-value>)',
            400: 'rgba(var(--magenta-400) / <alpha-value>)',
            500: 'rgba(var(--magenta-500) / <alpha-value>)',
            600: 'rgba(var(--magenta-600) / <alpha-value>)',
            700: 'rgba(var(--magenta-700) / <alpha-value>)',
            800: 'rgba(var(--magenta-800) / <alpha-value>)',
            900: 'rgba(var(--magenta-900) / <alpha-value>)',
            950: 'rgba(var(--magenta-950) / <alpha-value>)',
          },
          bg: {
            primary: 'rgba(var(--base-white) / <alpha-value>)',
            secondary: 'rgba(var(--neutral-100) / <alpha-value>)',
            tertiary: 'rgba(var(--neutral-200) / <alpha-value>)',
            quaternary: 'rgba(var(--neutral-300) / <alpha-value>)',
            brand: {
              primary: 'rgba(var(--primary-50) / <alpha-value>)',
              secondary: 'rgba(var(--primary-100) / <alpha-value>)',
              tertiary: 'rgba(var(--primary-200) / <alpha-value>)',
            },
            system: {
              success: 'rgba(var(--success-200) / <alpha-value>)',
              warning: 'rgba(var(--warning-200) / <alpha-value>)',
              error: 'rgba(var(--error-200) / <alpha-value>)',
            },
          },
          fg: {
            primary: 'rgba(var(--neutral-900) / <alpha-value>)',
            secondary: 'rgba(var(--neutral-800) / <alpha-value>)',
            tertiary: 'rgba(var(--neutral-600) / <alpha-value>)',
            brand: {
              primary: 'rgba(var(--primary-500) / <alpha-value>)',
              secondary: 'rgba(var(--primary-600) / <alpha-value>)',
              tertiary: 'rgba(var(--primary-700) / <alpha-value>)',
            },
            system: {
              success: 'rgba(var(--success-800) / <alpha-value>)',
              warning: 'rgba(var(--warning-800) / <alpha-value>)',
              error: 'rgba(var(--error-800) / <alpha-value>)',
            },
          },
          border: {
            primary: 'rgba(var(--base-white) / <alpha-value>)',
            secondary: 'rgba(var(--neutral-100) / <alpha-value>)',
            tertiary: 'rgba(var(--neutral-200) / <alpha-value>)',
            quaternary: 'rgba(var(--neutral-300) / <alpha-value>)',
            brand: {
              primary: 'rgba(var(--primary-400) / <alpha-value>)',
              secondary: 'rgba(var(--primary-500) / <alpha-value>)',
              tertiary: 'rgba(var(--primary-600) / <alpha-value>)',
            },
            system: {
              success: 'rgba(var(--success-400) / <alpha-value>)',
              warning: 'rgba(var(--warning-400) / <alpha-value>)',
              error: 'rgba(var(--error-400) / <alpha-value>)',
            },
            focus: 'rgba(var(--primary-200) / <alpha-value>)',
          },
        },
        basics: {
          black: 'rgba(var(--basics-black) / <alpha-value>)',
          white: 'rgba(var(--basics-white) / <alpha-value>)',
          green: 'rgba(var(--basics-green) / <alpha-value>)',
          red: 'rgba(var(--basics-red) / <alpha-value>)',
          border: 'var(--basics-border)',
          'dark-grey': 'rgba(var(--basics-dark-grey) / <alpha-value>)',
          grey: 'rgba(var(--basics-grey) / <alpha-value>)',
          'light-grey': 'rgba(var(--basics-light-grey) / <alpha-value>)',
        },
        main: {
          blue: 'rgba(var(--main-blue) / <alpha-value>)',
        },
        sec: {
          green: 'rgba(var(--sec-green) / <alpha-value>)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        body: 'hsl(var(--body-background))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'var(--primary)',
          bg: 'hsl(var(--primary-bg))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        nav: {
          primary: 'rgb(var(--nav-primary))',
        },
        panel: {
          border: 'var(--panel-border)',
          bg: 'var(--panel-bg)',
        },
        'input-background': 'var(--input-background)',
        'icon-foreground': 'rgba(var(--icon-foreground) / <alpha-value>)',
        'product-blue': 'rgba(var(--product-blue) / <alpha-value>)',
        'product-green': 'rgba(var(--product-green) / <alpha-value>)',
        'product-orange': 'rgba(var(--product-orange) / <alpha-value>)',
        'product-red': 'rgba(var(--product-red) / <alpha-value>)',
        'product-dai': 'rgba(var(--product-dai) / <alpha-value>)',
        'product-sdai': 'rgba(var(--product-sdai) / <alpha-value>)',
        'prompt-foreground': 'var(--prompt-foreground)',
        'success-background': 'var(--success-background)',
        spark: 'rgba(var(--spark) / <alpha-value>)',
        checkbox: 'var(--checkbox)',
        error: 'rgba(var(--product-red) / <alpha-value>)',
        'light-blue': 'rgba(var(--nav-primary) / <alpha-value>)',
        'product-dark-blue': 'rgb(var(--product-dark-blue))',
      },
      boxShadow: {
        nav: '0px 20px 40px 0px var(--nav-shadow)',
        tooltip: '0px 4px 30px 7px var(--tooltip-shadow)',
      },
      borderRadius: {
        '3xl': 'calc(var(--radius) + 16px)',
        '2xl': 'calc(var(--radius) + 8px)',
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0px' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0px' },
        },
        'sprinkle-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
        'sprinkle-come-in-out': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'sprinkle-spin': 'sprinkle-spin 1s linear',
        'sprinkle-come-in-out': 'sprinkle-come-in-out 700ms forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
