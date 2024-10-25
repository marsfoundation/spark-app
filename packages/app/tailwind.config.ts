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
            white: 'rgb(var(--base-white))',
            black: 'rgb(var(--base-black))',
          },
          neutral: {
            50: 'rgb(var(--neutral-50))',
            100: 'rgb(var(--neutral-100))',
            200: 'rgb(var(--neutral-200))',
            300: 'rgb(var(--neutral-300))',
            400: 'rgb(var(--neutral-400))',
            500: 'rgb(var(--neutral-500))',
            600: 'rgb(var(--neutral-600))',
            700: 'rgb(var(--neutral-700))',
            800: 'rgb(var(--neutral-800))',
            900: 'rgb(var(--neutral-900))',
            950: 'rgb(var(--neutral-950))',
          },
          primary: {
            50: 'rgb(var(--primary-50))',
            100: 'rgb(var(--primary-100))',
            200: 'rgb(var(--primary-200))',
            300: 'rgb(var(--primary-300))',
            400: 'rgb(var(--primary-400))',
            500: 'rgb(var(--primary-500))',
            600: 'rgb(var(--primary-600))',
            700: 'rgb(var(--primary-700))',
            800: 'rgb(var(--primary-800))',
            900: 'rgb(var(--primary-900))',
            950: 'rgb(var(--primary-950))',
          },
          success: {
            50: 'rgb(var(--success-50))',
            100: 'rgb(var(--success-100))',
            200: 'rgb(var(--success-200))',
            300: 'rgb(var(--success-300))',
            400: 'rgb(var(--success-400))',
            500: 'rgb(var(--success-500))',
            600: 'rgb(var(--success-600))',
            700: 'rgb(var(--success-700))',
            800: 'rgb(var(--success-800))',
            900: 'rgb(var(--success-900))',
            950: 'rgb(var(--success-950))',
          },
          warning: {
            50: 'rgb(var(--warning-50))',
            100: 'rgb(var(--warning-100))',
            200: 'rgb(var(--warning-200))',
            300: 'rgb(var(--warning-300))',
            400: 'rgb(var(--warning-400))',
            500: 'rgb(var(--warning-500))',
            600: 'rgb(var(--warning-600))',
            700: 'rgb(var(--warning-700))',
            800: 'rgb(var(--warning-800))',
            900: 'rgb(var(--warning-900))',
            950: 'rgb(var(--warning-950))',
          },
          error: {
            50: 'rgb(var(--error-50))',
            100: 'rgb(var(--error-100))',
            200: 'rgb(var(--error-200))',
            300: 'rgb(var(--error-300))',
            400: 'rgb(var(--error-400))',
            500: 'rgb(var(--error-500))',
            600: 'rgb(var(--error-600))',
            700: 'rgb(var(--error-700))',
            800: 'rgb(var(--error-800))',
            900: 'rgb(var(--error-900))',
            950: 'rgb(var(--error-950))',
          },
          green: {
            50: 'rgb(var(--green-50))',
            100: 'rgb(var(--green-100))',
            200: 'rgb(var(--green-200))',
            300: 'rgb(var(--green-300))',
            400: 'rgb(var(--green-400))',
            500: 'rgb(var(--green-500))',
            600: 'rgb(var(--green-600))',
            700: 'rgb(var(--green-700))',
            800: 'rgb(var(--green-800))',
            900: 'rgb(var(--green-900))',
            950: 'rgb(var(--green-950))',
          },
          orange: {
            50: 'rgb(var(--orange-50))',
            100: 'rgb(var(--orange-100))',
            200: 'rgb(var(--orange-200))',
            300: 'rgb(var(--orange-300))',
            400: 'rgb(var(--orange-400))',
            500: 'rgb(var(--orange-500))',
            600: 'rgb(var(--orange-600))',
            700: 'rgb(var(--orange-700))',
            800: 'rgb(var(--orange-800))',
            900: 'rgb(var(--orange-900))',
            950: 'rgb(var(--orange-950))',
          },
          magenta: {
            50: 'rgb(var(--magenta-50))',
            100: 'rgb(var(--magenta-100))',
            200: 'rgb(var(--magenta-200))',
            300: 'rgb(var(--magenta-300))',
            400: 'rgb(var(--magenta-400))',
            500: 'rgb(var(--magenta-500))',
            600: 'rgb(var(--magenta-600))',
            700: 'rgb(var(--magenta-700))',
            800: 'rgb(var(--magenta-800))',
            900: 'rgb(var(--magenta-900))',
            950: 'rgb(var(--magenta-950))',
          },
          bg: {
            primary: 'rgb(var(--base-white))',
            secondary: 'rgb(var(--neutral-100))',
            tertiary: 'rgb(var(--neutral-200))',
            quaternary: 'rgb(var(--neutral-300))',
            brand: {
              primary: 'rgb(var(--primary-50))',
              secondary: 'rgb(var(--primary-100))',
              tertiary: 'rgb(var(--primary-200))',
            },
            system: {
              success: 'rgb(var(--success-200))',
              warning: 'rgb(var(--warning-200))',
              error: 'rgb(var(--error-200))',
            },
          },
          fg: {
            primary: 'rgb(var(--neutral-900))',
            secondary: 'rgb(var(--neutral-800))',
            tertiary: 'rgb(var(--neutral-600))',
            brand: {
              primary: 'rgb(var(--primary-500))',
              secondary: 'rgb(var(--primary-600))',
              tertiary: 'rgb(var(--primary-700))',
            },
            system: {
              success: 'rgb(var(--success-800))',
              warning: 'rgb(var(--warning-800))',
              error: 'rgb(var(--error-800))',
            },
          },
          border: {
            primary: 'rgb(var(--base-white))',
            secondary: 'rgb(var(--neutral-100))',
            tertiary: 'rgb(var(--neutral-200))',
            quaternary: 'rgb(var(--neutral-300))',
            brand: {
              primary: 'rgb(var(--primary-400))',
              secondary: 'rgb(var(--primary-500))',
              tertiary: 'rgb(var(--primary-600))',
            },
            system: {
              success: 'rgb(var(--success-400))',
              warning: 'rgb(var(--warning-400))',
              error: 'rgb(var(--error-400))',
            },
            focus: 'rgb(var(--primary-200))',
          },
        },
        basics: {
          black: 'rgb(var(--basics-black))',
          white: 'rgb(var(--basics-white))',
          green: 'rgb(var(--basics-green))',
          red: 'rgb(var(--basics-red))',
          border: 'var(--basics-border)',
          'dark-grey': 'rgb(var(--basics-dark-grey))',
          grey: 'rgb(var(--basics-grey))',
          'light-grey': 'rgb(var(--basics-light-grey))',
        },
        main: {
          blue: 'rgb(var(--main-blue))',
        },
        sec: {
          green: 'rgb(var(--sec-green))',
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
        'icon-foreground': 'rgb(var(--icon-foreground))',
        'product-blue': 'rgb(var(--product-blue))',
        'product-green': 'rgb(var(--product-green))',
        'product-orange': 'rgb(var(--product-orange))',
        'product-red': 'rgb(var(--product-red))',
        'product-dai': 'rgb(var(--product-dai))',
        'product-sdai': 'rgb(var(--product-sdai))',
        'prompt-foreground': 'var(--prompt-foreground)',
        'success-background': 'var(--success-background)',
        spark: 'rgb(var(--spark))',
        checkbox: 'var(--checkbox)',
        error: 'rgb(var(--product-red))',
        'light-blue': 'rgb(var(--nav-primary))',
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
