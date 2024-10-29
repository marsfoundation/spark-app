import { join } from 'node:path'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '.storybook/components/**/*.{ts,tsx}',
  ],
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
        roobert: ['Roobert', ...defaultTheme.fontFamily.sans],
      },
      textColor: {
        primary: 'rgb(var(--base-black))',
        secondary: 'rgb(var(--neutral-500))',
        tertiary: 'rgb(var(--neutral-300))',
        brand: 'rgb(var(--primary-800))',
        inverse: 'rgb(var(--base-white))',
        success: 'rgb(var(--success-600))',
        warning: 'rgb(var(--warning-600))',
        error: 'rgb(var(--error-700))',
      },
      colors: {
        reskin: {
          base: {
            white: 'rgb(var(--base-white))',
            black: 'rgb(var(--base-black))',
          },
          neutral: {
            DEFAULT: 'rgb(var(--neutral-500))',
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
            DEFAULT: 'rgb(var(--primary-800))',
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
            DEFAULT: 'rgb(var(--success-600))',
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
            DEFAULT: 'rgb(var(--warning-600))',
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
            DEFAULT: 'rgb(var(--error-700))',
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
            DEFAULT: 'rgb(var(--green-600))',
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
            DEFAULT: 'rgb(var(--orange-600))',
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
            DEFAULT: 'rgb(var(--magenta-600))',
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
            primary: {
              DEFAULT: 'rgb(var(--base-white))',
              inverse: 'rgb(var(--base-black))',
            },
            secondary: {
              DEFAULT: 'rgb(var(--neutral-50))',
              inverse: 'rgb(var(--neutral-950))',
            },
            tertiary: 'rgb(var(--neutral-100))',
            quaternary: 'rgb(var(--neutral-200))',
            brand: {
              primary: 'rgb(var(--primary-100))',
              secondary: 'rgb(var(--primary-200))',
              tertiary: 'rgb(var(--primary-300))',
            },
            system: {
              success: {
                primary: 'rgb(var(--success-100))',
                secondary: 'rgb(var(--success-200))',
              },
              warning: {
                primary: 'rgb(var(--warning-100))',
                secondary: 'rgb(var(--warning-200))',
              },
              error: {
                primary: 'rgb(var(--error-100))',
                secondary: 'rgb(var(--error-200))',
              },
              info: {
                primary: 'rgb(var(--magenta-100))',
                secondary: 'rgb(var(--magenta-200))',
              },
            },
          },
          fg: {
            primary: {
              DEFAULT: 'rgb(var(--neutral-950))',
              inverse: 'rgb(var(--neutral-50))',
            },
            secondary: {
              DEFAULT: 'rgb(var(--neutral-800))',
              inverse: 'rgb(var(--neutral-200))',
            },
            tertiary: 'rgb(var(--neutral-600))',
            quaternary: 'rgb(var(--neutral-500))',
            brand: {
              primary: 'rgb(var(--primary-500))',
              secondary: 'rgb(var(--primary-600))',
              tertiary: 'rgb(var(--primary-700))',
              quaternary: 'rgb(var(--primary-800))',
            },
            system: {
              success: {
                primary: 'rgb(var(--success-500))',
                secondary: 'rgb(var(--success-600))',
              },
              warning: {
                primary: 'rgb(var(--warning-500))',
                secondary: 'rgb(var(--warning-600))',
              },
              error: {
                primary: 'rgb(var(--error-500))',
                secondary: 'rgb(var(--error-600))',
              },
              info: {
                primary: 'rgb(var(--magenta-500))',
                secondary: 'rgb(var(--magenta-600))',
              },
            },
          },
          alpha: {
            dialog: 'color-mix(in srgb, rgb(var(--base-black)) 40%, transparent)',
          },
          border: {
            primary: 'rgb(var(--neutral-100))',
            secondary: 'rgb(var(--neutral-200))',
            tertiary: 'rgb(var(--neutral-300))',
            quaternary: 'rgb(var(--neutral-400))',
            brand: {
              primary: 'rgb(var(--primary-400))',
              secondary: 'rgb(var(--primary-500))',
              tertiary: 'rgb(var(--primary-600))',
            },
            system: {
              success: {
                primary: 'rgb(var(--success-500))',
                secondary: 'rgb(var(--success-600))',
              },
              warning: {
                primary: 'rgb(var(--warning-500))',
                secondary: 'rgb(var(--warning-600))',
              },
              error: {
                primary: 'rgb(var(--error-500))',
                secondary: 'rgb(var(--error-600))',
              },
              info: {
                primary: 'rgb(var(--magenta-500))',
                secondary: 'rgb(var(--magenta-600))',
              },
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
      backgroundImage: {
        'gradient-spark-primary': 'linear-gradient(270.98deg, #FFCD4D -5.71%, #FA43BD 102.6%)',
        'gradient-orange': 'linear-gradient(89.87deg, #FF895D 0.14%, #FFE6A4 50.03%, #FFFFFF 99.92%)',
        'gradient-purple': 'linear-gradient(90.22deg, #7A6BFF 0.12%, #BDDEFF 49.95%, #FFFFFF 99.78%)',
        'gradient-magenta': 'linear-gradient(89.84deg, #FA43BD -2.08%, #FFB5B5 48.92%, #FFFFFF 99.92%)',
        'gradient-green': 'linear-gradient(90deg, #11B93E 0%, #40DA69 50.47%, #FFFFFF 100%)',
      },
      fontWeight: {
        regular: '400',
        medium: '500',
      },
      boxShadow: {
        nav: '0px 20px 40px 0px var(--nav-shadow)',
        tooltip: '0px 4px 30px 7px var(--tooltip-shadow)',
        xs: '0px 1px 4px rgba(16, 16, 20, 0.05)',
        sm: '0px 1px 10px rgba(16, 16, 20, 0.1), 0px 1px 2px rgba(16, 16, 20, 0.06)',
        md: '0px 4px 14px -2px rgba(16, 16, 20, 0.1), 0px 2px 8px -2px rgba(16, 16, 20, 0.04)',
        lg: '0px 12px 16px -4px rgba(16, 16, 20, 0.08), 0px 4px 6px -2px rgba(16, 16, 20, 0.03)',
        xl: '0px 20px 24px -4px rgba(16, 16, 20, 0.08), 0px 8px 8px -4px rgba(16, 16, 20, 0.03)',
        '2xl': '0px 24px 48px -12px rgba(16, 16, 20, 0.18)',
        '3xl': '0px 32px 64px -12px rgba(16, 16, 20, 0.24)',
      },
      borderRadius: {
        xss: '4px',
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '36px',
      },
      blur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '60px',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '60px',
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
        reveal: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'sprinkle-spin': 'sprinkle-spin 1s linear',
        'sprinkle-come-in-out': 'sprinkle-come-in-out 700ms forwards',
        reveal: 'reveal 0.25s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(({ addUtilities, theme }) => {
      addUtilities({
        // @note text-display-* font weight is intentionally set to 500
        // Downloadable link contains only 500 weight variant of Roobert font
        // according to the guideline only 500 should be used for headings so that might be possible reason
        // (each weight has to be bought independently) - Need to clarify with design team
        '.typography-display-1': {
          fontSize: '2.375rem', // 38px
          lineHeight: '2.375rem', // 38px
          letterSpacing: 'calc(-2 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-display-2': {
          fontSize: '1.875rem', // 30px
          lineHeight: '1.875rem', // 30px
          letterSpacing: 'calc(-2 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-display-3': {
          fontSize: '1.5rem', // 24px
          lineHeight: '1.5rem', // 24px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-heading-1': {
          fontSize: '2.625rem', // 42px
          lineHeight: '3rem', // 48px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-heading-2': {
          fontSize: '2rem', // 32px
          lineHeight: '2.5rem', // 40px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-heading-3': {
          fontSize: '1.5rem', // 24px
          lineHeight: '1.75rem', // 28px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-heading-4': {
          fontSize: '1.25rem', // 20px
          lineHeight: '1.5rem', // 24px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-heading-5': {
          fontSize: '1.125rem', // 18px
          lineHeight: '1.25rem', // 20px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-body-1': {
          fontSize: '1.25rem', // 20px
          lineHeight: '1.875rem', // 30px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '400',
          fontFamily: theme('fontFamily.sans'),
        },

        '.typography-body-2': {
          fontSize: '1.125rem', // 18px
          lineHeight: '1.75rem', // 28px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '400',
          fontFamily: theme('fontFamily.sans'),
        },

        '.typography-body-3': {
          fontSize: '1rem', // 16px
          lineHeight: '1.5rem', // 24px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '400',
          fontFamily: theme('fontFamily.sans'),
        },

        '.typography-body-4': {
          fontSize: '0.875rem', // 14px
          lineHeight: '1.25rem', // 20px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '400',
          fontFamily: theme('fontFamily.sans'),
        },

        '.typography-body-5': {
          fontSize: '0.75rem', // 12px
          lineHeight: '1.125rem', // 18px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '400',
          fontFamily: theme('fontFamily.sans'),
        },

        '.typography-body-6': {
          fontSize: '0.625rem', // 10px
          lineHeight: '0.875rem', // 14px
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '400',
          fontFamily: theme('fontFamily.sans'),
        },

        // @todo update typography below when added
        '.typography-label-1': {
          fontSize: '1.5rem',
          lineHeight: '1.75rem',
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-label-2': {
          fontSize: '1.25rem',
          lineHeight: '1.5rem',
          letterSpacing: 'calc(-1 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-label-3': {
          fontSize: '1.125rem',
          lineHeight: '1.375rem',
          letterSpacing: 'calc(-0.5 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-label-4': {
          fontSize: '1rem',
          lineHeight: '1.125rem',
          letterSpacing: 'calc(-0.5 * 0.01em)',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-label-5': {
          fontSize: '0.875rem',
          lineHeight: '1rem',
          letterSpacing: '0px',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-label-6': {
          fontSize: '0.75rem',
          lineHeight: '1rem',
          letterSpacing: '0px',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-button-1': {
          fontSize: '1rem',
          lineHeight: '1.25rem',
          letterSpacing: '0px',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '.typography-button-2': {
          fontSize: '0.875rem',
          lineHeight: '1rem',
          letterSpacing: '0px',
          fontWeight: '500',
          fontFamily: theme('fontFamily.roobert'),
        },

        '@screen sm': {
          '.typography-display-1': {
            fontSize: '7.25rem', // 116px
            lineHeight: '7.25rem', // 116px
          },

          '.typography-display-2': {
            fontSize: '4.5rem', // 72px
            lineHeight: '4.5rem', // 72px
          },

          '.typography-display-3': {
            fontSize: '3.5rem', // 56px
            lineHeight: '3.5rem', // 56px
          },

          '.typography-heading-1': {
            fontSize: '3rem', // 48px
            lineHeight: '3.75rem', // 60px
          },

          '.typography-heading-2': {
            fontSize: '2.625rem', // 42px
            lineHeight: '3rem', // 48px
          },

          '.typography-heading-3': {
            fontSize: '2rem', // 32px
            lineHeight: '2.5rem', // 40px
          },

          '.typography-heading-4': {
            fontSize: '1.5rem', // 24px
            lineHeight: '1.75rem', // 28px
          },

          '.typography-heading-5': {
            fontSize: '1.25rem', // 20px
            lineHeight: '1.5rem', // 24px
          },

          '.typography-body-1': {
            fontSize: '1.5rem', // 24px
            lineHeight: '2.25rem', // 36px
          },

          '.typography-body-2': {
            fontSize: '1.25rem', // 20px
            lineHeight: '1.875rem', // 30px
          },

          '.typography-body-3': {
            fontSize: '1.125rem', // 18px
            lineHeight: '1.75rem', // 28px
          },

          '.typography-body-4': {
            fontSize: '1rem', // 16px
            lineHeight: '1.5rem', // 24px
          },

          '.typography-body-5': {
            fontSize: '0.875rem', // 14px
            lineHeight: '1.25rem', // 20px
          },

          '.typography-body-6': {
            fontSize: '0.75rem', // 12px
            lineHeight: '1.125rem', // 18px
          },

          '.typography-label-1': {
            fontSize: '1.5rem', // 24px
            lineHeight: '1.75rem', // 28px
          },

          '.typography-label-2': {
            fontSize: '1.25rem', // 20px
            lineHeight: '1.5rem', // 24px
          },

          '.typography-label-3': {
            fontSize: '1.125rem', // 18px
            lineHeight: '1.375rem', // 22px
          },

          '.typography-label-4': {
            fontSize: '1rem', // 16px
            lineHeight: '1.125rem', // 18px
          },

          '.typography-label-5': {
            fontSize: '0.875rem', // 14px
            lineHeight: '1rem', // 16px
          },

          '.typography-label-6': {
            fontSize: '0.75rem', // 12px
            lineHeight: '1rem', // 16px
          },

          '.typography-button-1': {
            fontSize: '1rem', // 16px
            lineHeight: '1.25rem', // 20px
          },

          '.typography-button-2': {
            fontSize: '0.875rem', // 14px
            lineHeight: '1rem', // 16px
          },
        },
      })

      addUtilities({
        '.leading-spacious': {
          lineHeight: '150%',
        },
        '.leading-normal': {
          lineHeight: '125%',
        },
        '.leading-dense': {
          lineHeight: '100%',
        },

        // needed to override the default line heights
        '@screen sm': {
          '.leading-spacious': {
            lineHeight: '150%',
          },
          '.leading-normal': {
            lineHeight: '125%',
          },
          '.leading-dense': {
            lineHeight: '100%',
          },
        },
      })

      addUtilities({
        '.icon-xs': {
          height: '16px',
        },
        '.icon-sm': {
          height: '20px',
        },
        '.icon-md': {
          height: '24px',
        },
      })
    }),
  ],
} satisfies Config
