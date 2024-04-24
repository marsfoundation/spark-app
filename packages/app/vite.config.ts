import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { lingui } from '@lingui/vite-plugin'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { execSync } from 'child_process'

const buildSha = execSync('git rev-parse --short HEAD').toString().trimEnd()
const buildTime = new Date().toLocaleString('en-gb')

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
  ],
  resolve: {
    alias: {
      /**
       * This is related to problems with jsbi in production build: https://github.com/GoogleChromeLabs/jsbi/issues/70
       */
      jsbi: resolve(__dirname, '.', 'node_modules', 'jsbi', 'dist', 'jsbi-cjs.js'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.spark.fi/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/integration/setup.ts'],
    globals: true,
  },
})
