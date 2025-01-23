import { apiUrl } from '@/config/consts'
import * as Sentry from '@sentry/react'
import { shouldErrorBeTracked } from './shouldErrorBeTracked'

if (import.meta.env.VITE_SENTRY_DSN) {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log('Sentry integration enabled', { env: import.meta.env.VITE_ENV_NAME })
}

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tunnel: `${apiUrl}/sentry/tunnel`,
  environment: import.meta.env.VITE_ENV_NAME,
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  tracePropagationTargets: [],
  maxValueLength: 5000,
  beforeSend(event, hint) {
    const error = hint.originalException

    if (error instanceof Error && shouldErrorBeTracked(error)) {
      return event
    }

    return null
  },
  autoSessionTracking: false, // do not use sentry for analytics
})

export function captureError(error: Error): void {
  Sentry.captureException(error)
}
