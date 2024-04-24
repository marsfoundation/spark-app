export type TestTrigger = Promise<void>

export interface GetTestTriggerResult {
  trigger: TestTrigger
  release: () => void
}

/**
 * Useful for waiting for a condition to be met in a test and then changing behaviour of some kind of mock.
 */
export function getTestTrigger(): GetTestTriggerResult {
  let resolveFunction: () => void

  const trigger = new Promise<void>((resolve) => {
    resolveFunction = resolve
  })

  function release(): void {
    resolveFunction()
  }

  return { trigger, release }
}
