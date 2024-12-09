import { AssertionError } from './AssertionError'

export function assertNever(x: never): never {
  throw new AssertionError(`Unexpected object: ${x}`)
}
