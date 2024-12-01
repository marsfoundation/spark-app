import pLimit from 'p-limit'

/**
 * Note instead of array of promises, pass in an array of functions that return promises.
 */
export async function promiseAllWithLimitedConcurrency<T>(
  fns: Array<() => Promise<T>>,
  { maxConcurrency }: { maxConcurrency: number },
): Promise<Awaited<T>[]> {
  const limit = pLimit(maxConcurrency)

  return Promise.all(fns.map((fn) => limit(fn)))
}
