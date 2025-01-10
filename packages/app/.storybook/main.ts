import { join } from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'
import dotenv from 'dotenv'
import { mergeConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  features: {
    viewportStoryGlobals: true,
  },

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
    'storybook-addon-remix-react-router',
    '@chromatic-com/storybook',
    'storybook-addon-pseudo-states',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  docs: {},

  env: () => {
    const env = dotenv.config({ path: join(__dirname, '../.env.storybook') })
    if (env.error) {
      throw env.error
    }
    return env.parsed!
  },

  viteFinal: (config) =>
    mergeConfig(config, {
      plugins: [svgr()],
    }),
}
export default config
