import * as Sentry from '@sentry/react'

if (import.meta.env.VITE_SENTRY_DSN) {
  // eslint-disable-next-line no-console
  console.log('Sentry integration enabled', { env: import.meta.env.VITE_ENV_NAME })
}

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENV_NAME,
  integrations: [],
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  tracePropagationTargets: [],
  ignoreErrors: ['User rejected methods', 'User disapproved requested methods'],
})

export function captureError(error: Error): void {
  Sentry.captureException(error)
}
