import { withThemeByClassName } from '@storybook/addon-themes'
import { Preview } from '@storybook/react'
import { WithFixedDate, WithQueryClient } from './decorators'

import '../src/css/fonts.css'
import '../src/css/main.css'
import './styles.css'

const preview: Preview = {
  initialGlobals: {
    viewport: { value: 'desktop' },
  },
  parameters: {
    chromatic: {
      delay: 500, // Some components use hook for media queries, and chromatic might take a screenshot too early
      pauseAnimationAtEnd: false, // stops css animations at first frame
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      options: {
        mobile: {
          name: 'mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'tablet',
          styles: {
            width: '760px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'desktop',
          styles: {
            width: '1440px',
            height: '1024px',
          },
        },
      },
    },
  },
  decorators: [
    WithQueryClient(),
    WithFixedDate(),
    // Adds theme switching support.
    // NOTE: requires setting "darkMode" to "class" in your tailwind config
    // NOTE: order matters, this decorator must be the last one
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
}

export default preview
