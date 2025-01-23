export function shouldErrorBeTracked(error: Error): boolean {
  if (isIgnoredMessage(error) || isIgnoredStackTrace(error)) {
    return false
  }
  return isTrackedErrorType(error)
}

function isIgnoredMessage(error: Error): boolean {
  const networkErrorMessages = [
    'NetworkError',
    'Failed to fetch',
    'Load failed',
    'Importing a module script failed',
    'The I/O read operation failed',
    'fetch failed',
    'error loading dynamically imported module',
    'Connection terminated unexpectedly',
  ]

  const unsupportedContractsAndMethods = [
    'does not support contract "ensUniversalResolver"',
    'method "wallet_getCapabilities" does not exist',
  ]

  const walletConnectorMessages = ['Connector not connected']

  const walletUserInteractionErrors = [
    'User rejected the request',
    'User rejected methods',
    'User disapproved requested methods',
  ]

  return [
    ...networkErrorMessages,
    ...walletUserInteractionErrors,
    ...unsupportedContractsAndMethods,
    ...walletConnectorMessages,
  ].some((message) => error.message?.includes(message))
}

function isIgnoredStackTrace(error: Error): boolean {
  const ignoredStackTraces = [/@wagmi\/core\/.*\/injected/, /@wagmi\/core\/.*\/disconnect/]
  const errorStack = error.stack
  return errorStack ? ignoredStackTraces.some((pattern) => pattern.test(errorStack)) : false
}

function isTrackedErrorType(error: Error): boolean {
  const trackedErrors = ['TypeError', 'AssertionError', 'ZodError', 'QueryCacheCaughtError']
  return trackedErrors.some((errorName) => error.name === errorName)
}
