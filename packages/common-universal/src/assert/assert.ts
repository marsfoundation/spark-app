import { AssertionError } from './AssertionError'

export function assert(condition: unknown, error?: string | Error): asserts condition {
  if (!condition) {
    if (error) {
      raise(typeof error === 'string' ? `assertion failed: ${error}` : error)
    } else {
      raise('assertion failed')
    }
  }
}

export function raise(error: string | Error): never {
  if (error instanceof Error) {
    throw error
  }

  throw new AssertionError(error)
}
