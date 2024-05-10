import * as Sentry from '@sentry/react'

if (import.meta.env.VITE_FEATURE_SENTRY_DSN) {
  // eslint-disable-next-line no-console
  console.log('Sentry integration enabled', { env: import.meta.env.VITE_ENV_NAME })
}

Sentry.init({
  dsn: import.meta.env.VITE_FEATURE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENV_NAME,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 0,
  tracePropagationTargets: ['localhost'],
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
})

export function captureError(error: Error): void {
  Sentry.captureException(error)
}
