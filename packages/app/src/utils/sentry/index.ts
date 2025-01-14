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
  allowUrls: [
    // main production domain
    /^https:\/\/app\.spark\.fi/,
    // vercel staging and production
    /^https:\/\/spark-app-(staging|production)-mars-foundation\.vercel\.app/,
    // localhost
    ...(import.meta.env.VITE_SENTRY_DSN ? [/^https?:\/\/localhost:[0-9]+/] : []),
  ],
  integrations: [
    // allows to filter out third party errors (browser extensions, code-injection, etc.)
    Sentry.thirdPartyErrorFilterIntegration({
      filterKeys: [import.meta.env.VITE_SENTRY_APPLICATION_KEY],
      behaviour: 'drop-error-if-exclusively-contains-third-party-frames',
    }),
  ],
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
