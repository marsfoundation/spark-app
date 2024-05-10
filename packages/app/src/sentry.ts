import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_FEATURE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 0,
  tracePropagationTargets: ["localhost"],
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
});