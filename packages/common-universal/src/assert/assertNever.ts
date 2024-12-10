import { AssertionError } from './AssertionError.js'

export function assertNever(x: never): never {
  throw new AssertionError(`Unexpected object: ${x}`)
}
