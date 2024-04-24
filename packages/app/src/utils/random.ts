/**
 * Not cryptographically secure. Do not use for anything serious.
 */

export function randomHexId(): string {
  return Math.random().toString(16).slice(2)
}
export function randomInt(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}
