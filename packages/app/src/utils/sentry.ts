import { apiUrl } from '@/config/consts'
import * as Sentry from '@sentry/react'

if (import.meta.env.VITE_SENTRY_DSN) {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log('Sentry integration enabled', { env: import.meta.env.VITE_ENV_NAME })
}

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tunnel: `${apiUrl}/sentry/tunnel`,
  environment: import.meta.env.VITE_ENV_NAME,
  integrations: [],
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  tracePropagationTargets: [],
  maxValueLength: 5000,
  ignoreErrors: [
    'User rejected the request', // Rejecting a request using browser wallet
    'User rejected methods', // Happens sometimes with mobile wallets
    'User disapproved requested methods', // Happens when user rejects transaction using mobile wallet (connected by WalletConnect)
  ],
  beforeSend(event, hint) {
    const error = hint.originalException

    if (error instanceof Error && shouldErrorBeTracked(error)) {
      return event
    }

    return null
  },
  autoSessionTracking: false, // do not use sentry for analytics
})

function shouldErrorBeTracked(error: Error): boolean {
  const trackedErrors = ['TypeError', 'AssertionError', 'ZodError', 'RaiseError']

  return trackedErrors.some((errorName) => error.name === errorName)
}

export function captureError(error: Error): void {
  Sentry.captureException(error)
}
