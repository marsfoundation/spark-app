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
        grotesk: ['BDLifelessGrotesk', ...defaultTheme.fontFamily.sans],
      },
      colors: {
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
        border: 'hsl(var(--border) / .1)',
        input: 'hsl(var(--input)/ .1)',
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
          DEFAULT: 'hsl(var(--card) / .44)',
          foreground: 'hsl(var(--card-foreground))',
        },
        nav: {
          primary: 'hsl(var(--nav-primary))',
        },
        panel: {
          border: 'var(--panel-border)',
          bg: 'hsla(var(--panel-bg) / .44)',
        },
        'input-background': 'hsla(var(--input-background) / .1)',
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
