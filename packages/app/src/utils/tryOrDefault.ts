export function tryOrDefault<T>(fn: () => T, defaultValue: T): T {
  try {
    return fn()
  } catch (_) {
    return defaultValue
  }
}
