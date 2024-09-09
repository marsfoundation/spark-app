export function assert(condition: unknown, error?: string | Error): asserts condition {
  if (!condition) {
    if (error) {
      raise(error instanceof String ? new AssertionError(`assertion failed: ${error}`) : error)
    } else {
      raise(new AssertionError('assertion failed'))
    }
  }
}

export class AssertionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AssertionError'
  }
}

export function raise(error: string | Error): never {
  if (error instanceof Error) {
    throw error
  }

  throw new RaiseError(error)
}

export class RaiseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RaiseError'
  }
}
