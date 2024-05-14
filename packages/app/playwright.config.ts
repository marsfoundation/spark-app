import 'dotenv/config'
import { defineConfig, devices } from '@playwright/test'
import { createReplayReporterConfig, devices as replayDevices } from '@replayio/playwright'

const replayEnabled = process.env.REPLAY_ENABLED === '1'

console.log('Replay enabled?', replayEnabled)

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src',
  testMatch: '**/*.test-e2e.ts',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  // CI will use all available cores
  workers: process.env.CI || process.env.PLAYWRIGHT_PARALLEL ? '100%' : 1,
  reporter: replayEnabled ? [createReplayReporterConfig({}), ['line']] : [['html']],
  use: {
    baseURL: 'http://127.0.0.1:4000',
    trace: process.env.PLAYWRIGHT_TRACE === '1' ? 'on' : 'off',
    video: process.env.PLAYWRIGHT_TRACE === '1' ? 'retain-on-failure' : 'off',
  },
  expect: {
    timeout: 20_000,
  },
  timeout: 60_000 * 3, // sometimes tenderly can be slow
  maxFailures: undefined, // don't use this as it doesn't respect retires

  webServer: {
    command: 'pnpm build --mode playwright && pnpm exec serve dist -sL -p 4000',
    port: 4000,
    reuseExistingServer: true,
    timeout: 90_000,
  },
  fullyParallel: process.env.CI,

  projects: [
    replayEnabled
      ? {
          name: 'replay-chromium',
          use: { ...replayDevices['Replay Chromium'] },
        }
      : {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
  ],
})
