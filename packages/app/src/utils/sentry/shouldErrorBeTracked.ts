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
    'Request expired',
    'The request took too long to respond',
  ]

  const unsupportedContractsAndMethods = ['does not support contract "ensUniversalResolver"', 'wallet_getCapabilities']

  const walletConnectorMessages = [
    'Connector not connected',
    'connector.getChainId is not a function',
    'provider.disconnect is not a function',
    'not found for connector',
    '.disconnect is not a function',
    'does not support programmatic chain switching',
    "does not match the connection's chain",
  ]

  const walletUserInteractionErrors = [
    'User rejected the request',
    'User rejected methods',
    'User disapproved requested methods',
  ]

  const allowanceErrors = [
    '"approve" reverted',
    'transfer amount exceeds allowance',
    'insufficient-allowance',
    'transfer-from-failed',
    'transfer from failed',
  ]

  const gasErrors = ['to pay the network fees']

  return [
    ...networkErrorMessages,
    ...walletUserInteractionErrors,
    ...unsupportedContractsAndMethods,
    ...walletConnectorMessages,
    ...allowanceErrors,
    ...gasErrors,
  ].some((message) => error.message?.includes(message))
}

function isIgnoredStackTrace(error: Error): boolean {
  const ignoredStackTraces = [/@wagmi[\/\\]core.*[\/\\]injected/, /@wagmi[\/\\]core.*[\/\\]disconnect/]
  const errorStack = error.stack
  return errorStack ? ignoredStackTraces.some((pattern) => pattern.test(errorStack)) : false
}

function isTrackedErrorType(error: Error): boolean {
  const trackedErrors = ['TypeError', 'AssertionError', 'ZodError', 'HandledWriteError']
  return trackedErrors.some((errorName) => error.name === errorName)
}
