import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import { join } from 'node:path'
import dotenv from 'dotenv'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-styling',
    'storybook-addon-react-router-v6',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
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

// This addon can cause random Chrome crashes ("Snap!" errors) but works well in production.
// We need it to be able to force components into desired states for screenshots
if (process.env.NODE_ENV === 'production') {
  config.addons!.push('storybook-addon-pseudo-states')
}
