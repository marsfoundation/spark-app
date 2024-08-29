import { execSync } from 'node:child_process'
import { lingui } from '@lingui/vite-plugin'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const buildSha = execSync('git rev-parse --short HEAD').toString().trimEnd()
const buildTime = new Date().toLocaleString('en-gb')

// disable sentry integration on preview deployments
if (process.env.VERCEL_ENV === 'preview') {
  process.env.VITE_SENTRY_DSN = ''
}

export default defineConfig({
  define: {
    __BUILD_SHA__: JSON.stringify(buildSha),
    __BUILD_TIME__: JSON.stringify(buildTime),
  },

  plugins: [
    react({
      plugins: [['@lingui/swc-plugin', {}]],
    }),
    tsconfigPaths(),
    lingui(),
    svgr(),
    sentryVitePlugin({
      silent: true,
      telemetry: false,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    }),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'https://api-v2.spark.fi/api/v1/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ba-api': {
        target: 'https://spark-api.blockanalitica.com/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ba-api/, ''),
      },
      '/info-sky-api': {
        target: 'https://info-sky.blockanalitica.com/api/v1/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/info-sky-api/, ''),
      },
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/integration/setup.ts'],
    globals: true,
  },

  build: {
    sourcemap: true,
  },
})
